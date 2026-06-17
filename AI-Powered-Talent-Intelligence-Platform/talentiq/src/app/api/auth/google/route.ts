import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import connectToDatabase from '@/core/database/mongoose';
import { User } from '@/core/database/models/User';
import { Company } from '@/core/database/models/Company';
import { generateTokens } from '@/core/auth/jwt';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Google ID token required' }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token payload' }, { status: 400 });
    }

    const { email, name, sub: googleId, picture: avatar } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a default company for the new Google user
      const slug = `company-${Date.now()}`;
      const company = await Company.create({
        name: `${name}'s Company`,
        slug,
      });

      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        avatar,
        company: company._id,
        role: 'admin'
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.avatar = user.avatar || avatar;
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      companyId: user.company.toString(),
      role: user.role
    });

    user.refreshTokens.push(refreshToken);
    user.lastActiveAt = new Date();
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        companyId: user.company
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
    console.error('Google Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
