import sharp from "sharp";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const width = parseInt(formData.get("width"));
    const height = parseInt(formData.get("height"));
    const format = formData.get("format");

    if (!image) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    // Process the image and get a buffer instead of saving it
    const resizedBuffer = await sharp(buffer)
      .resize(width, height)
      .toFormat(format)
      .toBuffer();

    return new NextResponse(resizedBuffer, {
      status: 200,
      headers: {
        "Content-Type": `image/${format}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Image processing failed", details: error.message },
      { status: 500 }
    );
  }
}
