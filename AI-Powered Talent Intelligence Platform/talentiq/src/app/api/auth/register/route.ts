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
    const { name, email, password, companyName, companySize, hearAbout } = body;

    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create Company
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let company = await Company.findOne({ slug });
    if (!company) {
      company = await Company.create({
        name: companyName,
        slug,
        size: companySize || '1-10',
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      passwordHash,
      company: company._id,
      role: 'admin', // First user is admin
      hearAbout: hearAbout || '',
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      companyId: company._id.toString(),
      role: user.role
    });

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: company._id,
        companyName: company.name,
        companySlug: company.slug
      },
      accessToken,
      refreshToken
    }, { status: 201 });

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
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
