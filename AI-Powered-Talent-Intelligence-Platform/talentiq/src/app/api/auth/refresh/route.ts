import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { User } from '@/core/database/models/User';
import { verifyRefreshToken, generateTokens } from '@/core/auth/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    let refreshToken = null;
    
    try {
      const body = await req.json();
      refreshToken = body.refreshToken;
    } catch (e) {
      // Body might be empty
    }

    if (!refreshToken) {
      // Try to get from cookies
      refreshToken = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];
    }

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
      }

      // Remove old refresh token and issue new ones
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      
      const tokens = generateTokens({
        userId: user._id.toString(),
        companyId: user.company.toString(),
        role: user.role
      });

      user.refreshTokens.push(tokens.refreshToken);
      await user.save();

      const response = NextResponse.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });

      const isProduction = process.env.NODE_ENV === 'production';
    
      response.cookies.set('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 60 * 60, // 60 minutes
        path: '/'
      });

      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      return response;

    } catch (e) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

  } catch (error: any) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
