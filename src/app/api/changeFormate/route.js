import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const format = formData.get('format');

    if (!image) {
      return new NextResponse(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const convertedImage = await sharp(buffer)
      .toFormat(format)
      .toBuffer();

    return new NextResponse(convertedImage, {
      status: 200,
      headers: {
        'Content-Type': `image/${format}`,
      },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ 
      error: 'Conversion failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}