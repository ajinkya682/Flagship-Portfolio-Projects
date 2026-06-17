import { NextResponse } from 'next/server';
import connectToDatabase from '@/core/database/mongoose';
import { NewsletterSubscriber } from '@/core/database/models/NewsletterSubscriber';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    const newSubscriber = new NewsletterSubscriber({
      email,
    });

    await newSubscriber.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
