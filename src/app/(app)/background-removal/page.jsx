"use client";
import { useState, useRef, useEffect } from 'react';

export default function BackgroundRemoval() {
  const [imageUrl, setImageUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const processImage = async () => {
    if (!imageUrl || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      console.log("image url is ",imageUrl);
      const response = await fetch(imageUrl);
      console.log("response is ",response)
      const blob = await response.blob();
      console.log("blob is ",blob)
      const resultBlob = await removeBackground(blob, {
        output: {
          format: 'image/png',
          quality: 0.8
        }
      });
      
      setResultUrl(URL.createObjectURL(resultBlob));
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Background removal failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImageUrl(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Background Remover</h1>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="mb-4 block w-full"
        disabled={isProcessing}
      />
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={processImage}
          disabled={!imageUrl || isProcessing}
          className={`px-4 py-2 rounded text-white ${
            !imageUrl || isProcessing ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Remove Background'}
        </button>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Reset
        </button>
      </div>
      
      {imageUrl && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Original Image</h2>
          <img src={imageUrl} alt="Original" className="max-w-full h-auto border rounded" />
        </div>
      )}
      
      {resultUrl && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Result</h2>
          <img src={resultUrl} alt="Result" className="max-w-full h-auto border rounded mb-2" />
          <a
            href={resultUrl}
            download="background-removed.png"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
}