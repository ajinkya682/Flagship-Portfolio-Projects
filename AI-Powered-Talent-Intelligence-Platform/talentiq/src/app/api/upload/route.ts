import { NextResponse } from 'next/server';
import { imagekit } from '@/lib/imagekit';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Ensure environment variables are loaded
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.warn("ImageKit is not fully configured. Please add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT to .env");
      return NextResponse.json({ error: 'Storage service is not configured correctly' }, { status: 500 });
    }

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer, // can be a string, base64, or buffer
      fileName: filename,
      folder: '/talentiq/uploads' // Organize files in a specific folder
    });

    // Return the public URL
    return NextResponse.json({ url: uploadResult.url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
