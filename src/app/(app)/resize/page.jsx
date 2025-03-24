"use client";
import { useState } from "react";

const Resize = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [format, setFormat] = useState("png");
  const [downloadLink, setDownloadLink] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
    }
  };

  const handleResize = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("format", format);

    const response = await fetch("/api/resize", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    setDownloadLink(imageUrl);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-semibold text-center text-blue-400 mb-4">
          Resize Your Image
        </h1>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-md border border-gray-700"
            />
          </div>
        )}

        <label className="cursor-pointer w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
          Choose File
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </label>

        <div className="flex space-x-2 mt-4">
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Width"
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Height"
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full mt-4 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>

        
        <button
          onClick={handleResize}
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Resize Image
        </button>

        {downloadLink && (
          <div className="mt-4 text-center">
            <a
              href={downloadLink}
              download
              className="text-blue-400 font-semibold hover:underline"
            >
              Download Resized Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resize;
