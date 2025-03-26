"use client";
import { useState, useRef } from "react";

export default function BackgroundRemoval() {
  const [imageUrl, setImageUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState("png");
  const fileInputRef = useRef(null);

  const formatMap = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("format", format);

    try {
      const response = await fetch("/api/changeFormate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");
      const blob = await response.blob();
      setImageUrl(URL.createObjectURL(blob));
      setResultUrl(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async () => {
    if (!imageUrl || isProcessing) return;

    setIsProcessing(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const resultBlob = await removeBackground(blob, {
        output: { format: formatMap[format], quality: 0.8 },
      });

      setResultUrl(URL.createObjectURL(resultBlob));
    } catch {
      alert("Background removal failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImageUrl(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-screen h-screen flex justify-center bg-gray-900 shadow-lg overflow-x-hidden items-center">
      <div className="w-screen h-[60vh] flex gap-[10vw]">
      <div className="w-[30%]">
      {imageUrl && (
          <div className="w-[100%] h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-white">Original Image</h2>
            <div className="flex-1 relative min-h-0">
              <img src={imageUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
        

        <div className="flex flex-col gap-[4vh] bg-gray-800 p-[3vw] rounded-4xl h-[85%] self-center">
          <h1 className="text-2xl font-bold text-blue-400">Background Remover</h1>

          <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="p-[4%] block w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-4xl" disabled={isProcessing} />

          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400" disabled={isProcessing}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>

          <div className="flex gap-2 mb-4">
            <button onClick={processImage} disabled={!imageUrl || isProcessing} className={`px-4 py-2 rounded text-white ${!imageUrl || isProcessing ? "bg-gray-400" : "bg-blue-500"}`}>
              {isProcessing ? "Processing..." : "Remove Background"}
            </button>
            <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded">
              Reset
            </button>
          </div>
        </div>

        {resultUrl && (
          <div className="h-full flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-white">Result</h2>
            <div className="max-w-[30vw] flex-1 min-h-0 max-h-full">
              <img src={resultUrl} alt="Result" className="w-full h-full border rounded object-contain" />
            </div>
            <a href={resultUrl} download={`background-removed.${format}`} className="bg-green-500 text-white rounded w-[50%] p-[2%] rounded-2xl hover:bg-green-700 transition duration-200 text-center">
              Download Result
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
