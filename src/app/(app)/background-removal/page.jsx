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
    <div className='w-screen h-screen flex justify-center bg-gray-900 shadow-lg overflow-x-hidden items-center'>
    <div className='w-screen h-[60vh] flex gap-[10vw] '>
    <div className='w-[30%] h-full flex flex-col'>
  {imageUrl && (
    <div className="mb-4 flex-1 flex flex-col min-h-0">
      <h2 className="text-lg font-semibold mb-2">Original Image</h2>
      <div className="flex-1 relative min-h-0">
        <img 
          src={imageUrl} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    </div>
  )}
</div>
       <div className="flex flex-col gap-[5vh] bg-gray-800 p-[4vw] rounded-4xl h-[70%] self-center">
      <h1 className="text-2xl font-bold text-blue-400">Background Remover</h1>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className=" p-[4%] block w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-4xl"
        disabled={isProcessing}
      />
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={processImage}
          disabled={!imageUrl || isProcessing}
          className={`px-4 py-2 rounded text-white ${
            !imageUrl || isProcessing ? 'bg-gray-400' : 'bg-blue-500'
          } `}
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
    </div>
    <div>
    {resultUrl && (
        <div className='h-full flex flex-col gap-4'>
          <h2 className="text-lg font-semibold">Result</h2>
          <div className="max-w-[30vw] flex-1 min-h-0 max-h-[full]">
  <img 
    src={resultUrl} 
    alt="Result" 
    className="inset-0 w-full h-full border rounded object-contain"
  />
</div>
          
          <a
            href={resultUrl}
            download="background-removed.png"
            className=" bg-green-500 text-white rounded w-[50%] p-[2%] rounded-2xl hover:bg-green-700 transition duration-200"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
    </div>  
    </div>
    
  );
}