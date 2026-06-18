import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Company } from '@/core/database/models/Company';
import { verifyAccessToken } from '@/core/auth/jwt';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.companyId !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, logo, pipelineStages, ssoEnabled, apiKeys, billing } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (logo !== undefined) updateData.logo = logo;
    if (pipelineStages !== undefined) updateData.pipelineStages = pipelineStages;
    if (ssoEnabled !== undefined) updateData.ssoEnabled = ssoEnabled;
    if (billing !== undefined) updateData.billing = billing;
    if (apiKeys !== undefined) {
      updateData.apiKeys = apiKeys;
    }

    const company = await Company.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error('Update company error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Career site URL is already taken' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
