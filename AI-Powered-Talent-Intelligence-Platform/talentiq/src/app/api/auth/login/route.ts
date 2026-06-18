import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/core/database/mongoose';
import { User } from '@/core/database/models/User';
import { Company } from '@/core/database/models/Company';
import { generateTokens } from '@/core/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    let user = await User.findOne({ email }).select('+passwordHash').populate('company');
    
    // Auto-seed demo user if they try to log in but it doesn't exist yet
    if (!user && email === 'demo@talentiq.com' && password === 'Demo@123') {
      const company = await Company.create({
        name: 'TalentIQ Demo',
        industry: 'Technology',
        size: '51-200',
        slug: 'talentiq-demo'
      });
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      user = await User.create({
        name: 'Demo Admin',
        email,
        passwordHash,
        role: 'admin',
        company: company._id,
      });
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const companyIdStr = user.company._id ? user.company._id.toString() : user.company.toString();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      companyId: companyIdStr,
      role: user.role
    });

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    user.lastActiveAt = new Date();
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        companyId: companyIdStr,
        companyName: (user.company as any).name || 'TalentIQ Demo',
        companySlug: (user.company as any).slug || 'talentiq-demo',
        companyLogo: (user.company as any).logo
      },
      accessToken,
      refreshToken
    });

    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
