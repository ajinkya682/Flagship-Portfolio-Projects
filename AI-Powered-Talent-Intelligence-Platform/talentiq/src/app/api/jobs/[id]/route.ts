import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Job } from '@/core/database/models/Job';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const jobId = params.id;
    
    const { 
      status, title, department, location, type, remote, 
      salaryMin, salaryMax, description, requirements, skills, 
      applicationFormConfig 
    } = body;
    
    // Build update object dynamically to only update provided fields
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (department !== undefined) updateData.department = department;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (remote !== undefined) updateData.remote = remote;
    if (salaryMin !== undefined) updateData.salaryMin = salaryMin;
    if (salaryMax !== undefined) updateData.salaryMax = salaryMax;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (skills !== undefined) updateData.skills = skills;
    if (applicationFormConfig !== undefined) updateData.applicationFormConfig = applicationFormConfig;

    const job = await Job.findByIdAndUpdate(
      jobId, 
      { $set: updateData }, 
      { new: true }
    );

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}
