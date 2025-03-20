import sharp from "sharp";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const image = formData.get("image");
  const width = parseInt(formData.get("width"));
  const height = parseInt(formData.get("height"));
  const format = formData.get("format");

  if (!image) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const outputPath = path.join(process.cwd(), "public", `resized.${format}`);

  try {
    await sharp(buffer)
      .resize(width, height)
      .toFormat(format)
      .toFile(outputPath);

    return NextResponse.json({ success: true, url: `/resized.${format}` });
  } catch (error) {
    return NextResponse.json(
      { error: "Image processing failed", details: error.message },
      { status: 500 }
    );
  }
}
