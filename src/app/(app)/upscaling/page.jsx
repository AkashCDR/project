"use client";
import { useState, useEffect, useRef } from "react";
import Upscaler from "upscaler";
import * as tf from "@tensorflow/tfjs";

export default function SimpleImageUpscaler() {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const upscalerRef = useRef(null);

  useEffect(() => {
    upscalerRef.current = new Upscaler();
    return () => {
      tf.engine().disposeVariables();
      tf.backend().dispose();
    };
  }, []);

  const resizeImage = (img) => {
    const canvas = document.createElement("canvas");
    const maxSize = 1200;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const handleImageUpload = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const resized = resizeImage(img);
        setOriginalImage(resized);
        setUpscaledImage(null);
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const upscaleImage = async () => {
    if (!originalImage) return;

    setLoading(true);
    setError("");

    try {
      const result = await upscalerRef.current.upscale(originalImage, {
        patchSize: 64,
        padding: 2,
        output: "base64",
      });

      setUpscaledImage(result);
    } catch (err) {
      console.error("Upscale error:", err);
      setError("Upscaling failed. Try a smaller image or check your browser.");
    } finally {
      tf.engine().disposeVariables();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen gap-6">
      <h1 className="text-2xl font-bold text-blue-400">Simple Image Upscaler</h1>

      {error && <p className="bg-red-600 p-2 rounded">{error}</p>}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={loading}
        className="mb-4"
      />

      {originalImage && (
        <img src={originalImage} alt="Original" className="w-64 h-64 object-contain border" />
      )}

      <button
        onClick={upscaleImage}
        disabled={loading || !originalImage}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        {loading ? "Upscaling..." : "Upscale Image"}
      </button>

      {upscaledImage && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <h2 className="text-lg text-blue-300">Upscaled Image</h2>
          <img src={upscaledImage} alt="Upscaled" className="w-64 h-64 object-contain border" />
          <a
            href={upscaledImage}
            download="upscaled-image.png"
            className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

