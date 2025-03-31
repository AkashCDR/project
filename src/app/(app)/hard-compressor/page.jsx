"use client";
import { useState, useRef } from 'react';

export default function ExactSizeImageConverter() {
  const [imageUrl, setImageUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetSize, setTargetSize] = useState('');
  const [actualSize, setActualSize] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setActualSize(null);
  };

  const resizeToExactSize = async () => {
    if (!imageUrl || !targetSize || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const targetBytes = parseInt(targetSize) * 1024; // converting to bytes because this unit will be needed later
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      
      let minQuality = 0;
      let maxQuality = 1;
      let bestBlob = null;
      let iterations = 0;
      const maxIterations = 20; 
      const tolerance = 0.02; 

      // Binary Search

      while (iterations < maxIterations) {
        const midQuality = (minQuality + maxQuality) / 2;
        const blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b), `image/${format}`, midQuality);
        });

        if (!blob) break;

        const blobSize = blob.size;
        const sizeDifference = blobSize - targetBytes;
        const sizeRatio = Math.abs(sizeDifference) / targetBytes;

        if (sizeRatio <= tolerance) {
          bestBlob = blob;
          break;
        } else if (blobSize > targetBytes) {
          maxQuality = midQuality;
        } else {
          minQuality = midQuality;
          bestBlob = blob;
        }

        iterations++;
      }

      if (!bestBlob) {
        throw new Error("Couldn't achieve target size");
      }

      setActualSize((bestBlob.size / 1024).toFixed(2));
      setResultUrl(URL.createObjectURL(bestBlob));

    } catch (error) {
      console.error("Processing failed:", error);
      alert("Failed to resize image to exact size. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImageUrl(null);
    setResultUrl(null);
    setTargetSize('');
    setActualSize(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gray-900 text-gray-300 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Exact Size Image Converter</h1>
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target File Size (KB)
                </label>
                <input
                  type="number"
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  className="block w-full px-3 py-2 border text-whilte border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 50 for 50KB"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="block w-full px-3 py-2 bg-gray-800 border text-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={resizeToExactSize}
                disabled={!imageUrl || !targetSize || isProcessing}
                className={`px-4 py-2 rounded-md text-gray-300 bg-blue-600 hover:bg-blue-700`}
              >
                {isProcessing ? 'Processing...' : 'Convert to Exact Size'}
              </button>
              
              <button
                onClick={reset}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            {imageUrl && (
              <div>
                <h2 className="text-lg font-medium text-gray-300 mb-2">Original Image</h2>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Original" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium text-gray-300 mb-2">
                  Result ({actualSize} KB)
                </h2>
                <div className="border rounded-md overflow-hidden mb-4">
                  <img 
                    src={resultUrl} 
                    alt="Resized" 
                    className="w-full h-auto max-h-64 object-contain mx-auto"
                  />
                </div>
                <a
                  href={resultUrl}
                  download={`exact-size-image.${format}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-300 bg-green-600 hover:bg-green-700"
                >
                  Download Result
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}