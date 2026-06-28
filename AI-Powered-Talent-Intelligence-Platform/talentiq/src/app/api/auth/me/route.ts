export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { User } from '@/core/database/models/User';
import { Company } from '@/core/database/models/Company';
import { verifyAccessToken } from '@/core/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Ensure models are registered (prevents Webpack tree-shaking in production)
    if (!Company) console.warn('Company model not loaded');
    
    // Auth Check
    let token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = req.headers.get('cookie')?.split(';')?.find(c => c.trim().startsWith('accessToken='))?.split('=')[1];
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).populate('company');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const company = user.company as any;
    const companyIdStr = company ? (company._id ? company._id.toString() : company.toString()) : '';

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        companyId: companyIdStr,
        company: {
          id: companyIdStr,
          name: company?.name || 'TalentIQ Demo',
          slug: company?.slug || 'talentiq-demo',
          logo: company?.logo || '',
          ssoEnabled: company?.ssoEnabled || false,
          billing: company?.billing || { plan: 'starter' },
          pipelineStages: company?.pipelineStages || [],
        }
      }
    });

  } catch (error: any) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
