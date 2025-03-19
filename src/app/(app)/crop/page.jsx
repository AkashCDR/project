"use client"; // Mark as a Client Component

import { useState, useRef, useEffect } from 'react';
import uploadImage from "@/assets/upload_image.png";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Home() {
  const [src, setSrc] = useState(null); // Source image URL
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image URL
  const [isCropping, setIsCropping] = useState(false); // Whether the user is cropping
  const [startX, setStartX] = useState(0); // Starting X coordinate of the crop
  const [startY, setStartY] = useState(0); // Starting Y coordinate of the crop
  const [endX, setEndX] = useState(0); // Ending X coordinate of the crop
  const [endY, setEndY] = useState(0); // Ending Y coordinate of the crop
  const [shape, setShape] = useState('rectangle'); // Selected shape (rectangle, square, circle, triangle, ellipse)
  const canvasRef = useRef(null); // Reference to the canvas element
  const imageRef = useRef(null); // Reference to the image element

  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle mouse down event (start cropping)
  const handleMouseDown = (e) => {
    setIsCropping(true);
    const rect = e.target.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setStartY(e.clientY - rect.top);
    setEndX(e.clientX - rect.left);
    setEndY(e.clientY - rect.top);
  };

  // Handle mouse move event (draw cropping rectangle)
  const handleMouseMove = (e) => {
    if (isCropping) {
      const rect = e.target.getBoundingClientRect();
      setEndX(e.clientX - rect.left);
      setEndY(e.clientY - rect.top);
    }
  };

  // Handle mouse up event (finish cropping)
  const handleMouseUp = () => {
    setIsCropping(false);
    handleCrop();
  };

  // Handle image crop
  const handleCrop = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!image || !canvas) return;

    const ctx = canvas.getContext('2d');

    // Calculate crop dimensions
    let cropX, cropY, cropWidth, cropHeight;

    if (shape === 'square') {
      const size = Math.min(Math.abs(endX - startX), Math.abs(endY - startY));
      cropX = startX;
      cropY = startY;
      cropWidth = size;
      cropHeight = size;
    } else if (shape === 'circle') {
      const size = Math.min(Math.abs(endX - startX), Math.abs(endY - startY));
      cropX = startX;
      cropY = startY;
      cropWidth = size;
      cropHeight = size;
    } else if (shape === 'triangle') {
      cropX = Math.min(startX, endX);
      cropY = Math.min(startY, endY);
      cropWidth = Math.abs(endX - startX);
      cropHeight = Math.abs(endY - startY);
    } else if (shape === 'ellipse') {
      cropX = Math.min(startX, endX);
      cropY = Math.min(startY, endY);
      cropWidth = Math.abs(endX - startX);
      cropHeight = Math.abs(endY - startY);
    } else {
      // Rectangle (freeform)
      cropX = Math.min(startX, endX);
      cropY = Math.min(startY, endY);
      cropWidth = Math.abs(endX - startX);
      cropHeight = Math.abs(endY - startY);
    }

    // Set canvas dimensions to the crop size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw the cropped image on the canvas
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Apply shape (circle, triangle, or ellipse)
    if (shape === 'circle') {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(cropWidth / 2, cropHeight / 2, cropWidth / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'triangle') {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.moveTo(cropWidth / 2, 0); // Top vertex
      ctx.lineTo(cropWidth, cropHeight); // Bottom-right vertex
      ctx.lineTo(0, cropHeight); // Bottom-left vertex
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'ellipse') {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.ellipse(
        cropWidth / 2,
        cropHeight / 2,
        cropWidth / 2,
        cropHeight / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.fill();
    }

    // Convert canvas to image and set as cropped image
    const croppedImageUrl = canvas.toDataURL('image/png');
    setCroppedImage(croppedImageUrl);
  };

  // Ensure canvas manipulation only happens on the client side
  useEffect(() => {
    if (croppedImage) {
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!image || !canvas) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [croppedImage]);

  return (
    <div className='w-[70%] flex flex-row justify-center justify-self-center p-6 overflow-x-hidden'>
      <div className='flex flex-col content-center gap-6'>
        <h1 className='text-[3rem] text-blue-600 dark:text-sky-400'>Image Cropper</h1>
        <div className=' w-[75%] text-[1.5rem] text-gray-400 border-gray-400 border-2 flex flex-row items-baseline rounded-4xl'>

    <Image
      src={uploadImage}
      width={30}
      height={20}
      alt="upload image"
      className='m-[10px]'
    />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className='flex flex-row'>
          <div>
          {src && (
          <div>
         



            <div style={{ marginBottom: '10px' }}>
             

            <Select value={shape} onValueChange={(value) => setShape(value)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a Shape" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="rectangle">Rectangle</SelectItem>
    <SelectItem value="square">Square</SelectItem>
    <SelectItem value="circle">Circle</SelectItem>
    <SelectItem value="triangle">Triangle</SelectItem>
    <SelectItem value="ellipse">Ellipse</SelectItem>
  </SelectContent>
</Select>



            </div>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={src}
                alt="Source"
                style={{width:'80%', maxWidth: '100%', cursor: 'crosshair' }}
              />
              {isCropping && (
                <div
                  style={{
                    position: 'absolute',
                    border: '2px dashed red',
                    left: Math.min(startX, endX),
                    top: Math.min(startY, endY),
                    width: Math.abs(endX - startX),
                    height: Math.abs(endY - startY),
                  }}
                />
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
          </div>
          <div>
          {croppedImage && (
          <div>
            <h2 className='text-[2rem] text-blue-600 dark:text-sky-400 mb-4'>Cropped Image</h2>
            <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
            <a href={croppedImage} download="cropped-image.png">
              <Button variant="destructive" style={{ marginTop: '10px' }}>Download Cropped Image</Button>
            </a>
          </div>
        )}
          </div>
        </div>
        
        
      </div>
    </div>
  );
}