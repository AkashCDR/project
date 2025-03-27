import sharp from "sharp";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");
    const maskFile = formData.get("mask");
    const format = formData.get("format") || "png";
    const blurAmount = parseInt(formData.get("blurAmount")) || 20;

    if (!imageFile || !maskFile) {
      return NextResponse.json(
        { error: "Missing image or mask data" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer());

    const metadata = await sharp(imageBuffer).metadata();

    const blurredImage = await sharp(imageBuffer).blur(blurAmount).toBuffer();

    const processedMask = await sharp(maskBuffer)
      .resize(metadata.width, metadata.height, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer();

    const invertedMask = Buffer.from(processedMask);
    for (let i = 0; i < invertedMask.length; i += 4) {
      invertedMask[i + 3] = 255 - invertedMask[i + 3]; // Invert alpha channel
    }

    const originalWithMask = await sharp(imageBuffer)
      .ensureAlpha()
      .composite([
        {
          input: invertedMask,
          raw: {
            width: metadata.width,
            height: metadata.height,
            channels: 4,
          },
          blend: "dest-in",
        },
      ])
      .toBuffer();

    const blurredWithMask = await sharp(blurredImage)
      .ensureAlpha()
      .composite([
        {
          input: processedMask,
          raw: {
            width: metadata.width,
            height: metadata.height,
            channels: 4,
          },
          blend: "dest-in",
        },
      ])
      .toBuffer();

    const finalImage = await sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: originalWithMask },
        { input: blurredWithMask, blend: "add" },
      ])
      .toFormat(format)
      .toBuffer();

    return new NextResponse(finalImage, {
      status: 200,
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Blur processing error:", error);
    return NextResponse.json(
      { error: "Image processing failed", details: error.message },
      { status: 500 }
    );
  }
}
