"use client";
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const Blur = () => {
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [image, setImage] = useState(null);
  const [format, setFormat] = useState("png");
  const [downloadLink, setDownloadLink] = useState("");
  const [fabricImage, setFabricImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [blurAmount, setBlurAmount] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [originalPaths, setOriginalPaths] = useState([]);
  const [originalImageSize, setOriginalImageSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f0f0f0",
      preserveObjectStacking: true,
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "rgba(255,255,255,0.5)";
    canvas.freeDrawingBrush.width = brushSize;

    canvasInstance.current = canvas;
    setIsMounted(true);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvasInstance.current) return;

    canvasInstance.current.isDrawingMode = isDrawing;
    if (isDrawing) {
      canvasInstance.current.freeDrawingBrush.color = "rgba(255,255,255,0.5)";
      canvasInstance.current.freeDrawingBrush.width = brushSize;
    }
  }, [isDrawing, brushSize]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      setImage(url);

      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      // Store original image dimensions
      setOriginalImageSize({
        width: img.width,
        height: img.height,
      });

      if (!canvasInstance.current) return;

      canvasInstance.current.clear();

      const fabricImg = new fabric.Image(img, {
        selectable: false,
      });

      const canvasWidth = canvasInstance.current.width;
      const canvasHeight = canvasInstance.current.height;
      const scale = Math.min(
        canvasWidth / fabricImg.width,
        canvasHeight / fabricImg.height
      );

      fabricImg.scale(scale);
      fabricImg.set({
        left: (canvasWidth - fabricImg.width * scale) / 2,
        top: (canvasHeight - fabricImg.height * scale) / 2,
        originX: "left",
        originY: "top",
      });

      canvasInstance.current.add(fabricImg);
      canvasInstance.current.renderAll();
      setFabricImage(fabricImg);
    } catch (error) {
      console.error("Error loading image:", error);
      alert("Failed to load image. Please try again.");
    }
  };

  const enableDrawing = () => {
    if (!canvasInstance.current) return;
    setIsDrawing(!isDrawing);
  };

  const clearDrawing = () => {
    if (!canvasInstance.current || !fabricImage) return;

    const objects = canvasInstance.current.getObjects();
    objects.forEach((obj) => {
      if (obj !== fabricImage) {
        canvasInstance.current.remove(obj);
      }
    });
    canvasInstance.current.renderAll();
  };

  const applyBlur = async () => {
    if (!canvasInstance.current || !fabricImage) {
      alert("Upload an image and draw on it first!");
      return;
    }

    const drawnPaths = canvasInstance.current.getObjects("path");
    if (drawnPaths.length === 0) {
      alert("Please draw on the image first!");
      return;
    }


    const pathsToStore = drawnPaths.map((path) => ({
      path: path.path,
      stroke: path.stroke,
      strokeWidth: path.strokeWidth,
      fill: path.fill,
      opacity: path.opacity,
    }));
    setOriginalPaths(pathsToStore);

    setIsProcessing(true);
    try {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = fabricImage.width;
      maskCanvas.height = fabricImage.height;
      const maskCtx = maskCanvas.getContext("2d");

      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

      const scaleX =
        fabricImage.width / (fabricImage.width * fabricImage.scaleX);
      const scaleY =
        fabricImage.height / (fabricImage.height * fabricImage.scaleY);

      maskCtx.fillStyle = "black";
      maskCtx.strokeStyle = "white";
      maskCtx.lineWidth = 30 * scaleX;
      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";

      drawnPaths.forEach((path) => {
        if (!path.path) return;

        maskCtx.beginPath();
        path.path.forEach((point, index) => {
          const [cmd, ...coords] = point;

          const x = (coords[0] - fabricImage.left) * scaleX;
          const y = (coords[1] - fabricImage.top) * scaleY;

          if (cmd === "M") {
            maskCtx.moveTo(x, y);
          } else if (cmd === "L") {
            maskCtx.lineTo(x, y);
          } else if (cmd === "Q") {
            const qx = (coords[2] - fabricImage.left) * scaleX;
            const qy = (coords[3] - fabricImage.top) * scaleY;
            maskCtx.quadraticCurveTo(x, y, qx, qy);
          }
        });
        maskCtx.stroke();
      });

      const maskBlob = await new Promise((resolve) =>
        maskCanvas.toBlob(resolve, "png")
      );

      const formData = new FormData();
      formData.append("image", await fetch(image).then((r) => r.blob()));
      formData.append("mask", maskBlob);
      formData.append("format", format);
      formData.append("blurAmount", blurAmount);

      const response = await fetch("/api/blur", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
      setPreviewUrl(url);
      setShowPreview(true);

      fabric.Image.fromURL(url, (blurredImg) => {
        if (!blurredImg || !canvasInstance.current) return;

        canvasInstance.current.clear();

        const canvasWidth = canvasInstance.current.width;
        const canvasHeight = canvasInstance.current.height;
        const scale = Math.min(
          canvasWidth / blurredImg.width,
          canvasHeight / blurredImg.height
        );

        blurredImg.scale(scale);
        blurredImg.set({
          left: (canvasWidth - blurredImg.width * scale) / 2,
          top: (canvasHeight - blurredImg.height * scale) / 2,
          originX: "left",
          originY: "top",
          selectable: false,
        });

        canvasInstance.current.add(blurredImg);
        canvasInstance.current.renderAll();
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert(error.message || "Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white p-6">
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            className="border border-gray-700"
            width={800}
            height={600}
          />
        </div>

        {showPreview && previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400">Preview</h2>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewUrl(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                style={{ width: "800px", height: "600px" }}
              >
                <img
                  src={previewUrl}
                  alt="Blurred Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewUrl(null);
                    // Restore original image with drawings
                    if (canvasInstance.current && fabricImage) {
                      canvasInstance.current.clear();
                      canvasInstance.current.add(fabricImage);

                      // Restore all original paths with their properties
                      originalPaths.forEach((pathData) => {
                        const path = new fabric.Path(pathData.path, {
                          stroke: pathData.stroke,
                          strokeWidth: pathData.strokeWidth,
                          fill: pathData.fill,
                          opacity: pathData.opacity,
                          selectable: false,
                        });
                        canvasInstance.current.add(path);
                      });

                      canvasInstance.current.renderAll();
                    }
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition duration-200"
                >
                  Keep Editing
                </button>
                <a
                  href={downloadLink}
                  download={`blurred-image.${format}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-80 ml-6">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 sticky top-6">
          <h1 className="text-2xl font-semibold text-center text-blue-400 mb-6">
            Freehand Blur Image
          </h1>

          <label className="cursor-pointer w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            Choose Image
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </label>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Blur Amount
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={blurAmount}
              onChange={(e) => setBlurAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center text-sm text-gray-400">
              {blurAmount}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Brush Size</label>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value);
                setBrushSize(newSize);
                if (canvasInstance.current) {
                  canvasInstance.current.freeDrawingBrush.width = newSize;
                }
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center text-sm text-gray-400">{brushSize}</div>
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
            onClick={enableDrawing}
            className={`w-full mt-4 p-3 ${
              isDrawing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white rounded-lg font-semibold transition duration-200`}
            disabled={!image}
          >
            {isDrawing ? "Drawing Mode Active" : "Enable Drawing"}
          </button>

          {isDrawing && (
            <button
              onClick={clearDrawing}
              className="w-full mt-2 p-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200"
            >
              Clear Drawing
            </button>
          )}

          <button
            onClick={applyBlur}
            className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            disabled={!fabricImage || isProcessing}
          >
            {isProcessing ? "Processing..." : "Preview Blur"}
          </button>

          <div className="mt-4 text-sm text-gray-400">
            <p>Tips:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Use the brush size slider to adjust brush size</li>
              <li>Draw over areas you want to blur</li>
              <li>Use the blur amount slider to adjust blur intensity</li>
              <li>Preview your changes before downloading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blur;
