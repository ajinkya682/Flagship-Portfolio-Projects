import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { ContactSubmission } from '@/core/database/models/ContactSubmission';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { firstName, lastName, email, message } = body;
    
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newSubmission = new ContactSubmission({
      firstName,
      lastName,
      email,
      message,
    });

    await newSubmission.save();

    return NextResponse.json({ success: true, id: newSubmission._id });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
