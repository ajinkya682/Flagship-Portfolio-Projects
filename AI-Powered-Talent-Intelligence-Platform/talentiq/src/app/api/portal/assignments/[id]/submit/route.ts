import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { Assignment } from '@/core/database/models/Assignment';
import { Application } from '@/core/database/models/Application';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { submissionLink, submissionText } = body;

    if (!submissionLink && !submissionText) {
      return NextResponse.json(
        { error: 'Please provide either a submission link or description' },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (assignment.status === 'submitted') {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 });
    }

    assignment.submissionLink = submissionLink;
    assignment.submissionText = submissionText;
    assignment.submittedAt = new Date();
    assignment.status = 'submitted';
    await assignment.save();

    // Timeline event
    const application = await Application.findById(assignment.applicationId).populate('candidate');
    if (application) {
      application.timeline.push({
        event: `Assignment submitted: "${assignment.title}"`,
        date: new Date(),
        type: 'assignment',
      });
      await application.save();

      const candidate = application.candidate as any;
      const { Notification } = await import('@/core/database/models/Notification');
      await Notification.create({
        recipientUserId: 'all',
        type: 'assignment_submitted',
        title: 'Assignment Submitted',
        message: `${candidate?.name || 'A candidate'} has submitted their assignment.`,
        candidateId: candidate?._id,
        applicationId: application._id,
        assignmentId: assignment._id,
        linkHref: '/pipeline',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  }
}
