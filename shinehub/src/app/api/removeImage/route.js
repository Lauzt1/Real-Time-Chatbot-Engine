import cloudinary from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json(
        { error: `Deletion failed: ${result.result}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Image removed successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('removeImage error:', err);
    return NextResponse.json(
      { error: 'Server error while deleting image' },
      { status: 500 }
    );
  }
}