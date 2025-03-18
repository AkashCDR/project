"use client"; // Mark as a Client Component

import { useState, useRef } from 'react';

export default function Home() {
  const [src, setSrc] = useState(null); // Source image URL
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image URL
  const [isCropping, setIsCropping] = useState(false); // Whether the user is cropping
  const [startX, setStartX] = useState(0); // Starting X coordinate of the crop
  const [startY, setStartY] = useState(0); // Starting Y coordinate of the crop
  const [endX, setEndX] = useState(0); // Ending X coordinate of the crop
  const [endY, setEndY] = useState(0); // Ending Y coordinate of the crop
  const [shape, setShape] = useState('rectangle'); // Selected shape (rectangle, square, circle)
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

    // Apply shape (circle or square)
    if (shape === 'circle') {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(cropWidth / 2, cropHeight / 2, cropWidth / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    // Convert canvas to image and set as cropped image
    const croppedImageUrl = canvas.toDataURL('image/png');
    setCroppedImage(croppedImageUrl);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Image Cropper</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
      />
      {src && (
        <div>
          <h2>Crop Image</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>Shape: </label>
            <select value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
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
              style={{ maxWidth: '100%', cursor: 'crosshair' }}
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
      {croppedImage && (
        <div>
          <h2>Cropped Image</h2>
          <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
          <a href={croppedImage} download="cropped-image.png">
            <button style={{ marginTop: '10px' }}>Download Cropped Image</button>
          </a>
        </div>
      )}
    </div>
  );
}