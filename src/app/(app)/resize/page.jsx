"use client";
import { useState } from "react";

const Resize = () => {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(850);
  const [height, setHeight] = useState(713);
  const [format, setFormat] = useState("png");
  const [downloadLink, setDownloadLink] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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

    const data = await response.json();
    console.log(data);
    
    if (data.success) {
      setDownloadLink(data.url);
    } else {
      alert("Failed to resize image.");
    }
  };

  return (
    <div className="p-5">
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        placeholder="Width"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Height"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="png">PNG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WEBP</option>
      </select>
      <button
        onClick={handleResize}
        className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Resize Image
      </button>

      {downloadLink && (
        <div>
          <a
            href={downloadLink}
            download
            className="text-blue-500 hover:underline"
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
};

export default Resize;
