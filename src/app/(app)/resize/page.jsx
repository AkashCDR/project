'use client'
import React, { useState } from 'react'

const Resize = () => {
  const [image, setImage] = useState(null);
    const [width, setWidth] = useState(850);
    const [height, setHeight] = useState(713);
    const [format, setFormat] = useState('png');
    const [downloadLink, setDownloadLink] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleResize = async () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('format', format);

        const response = await fetch('/api/resize', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            setDownloadLink(data.url);
        } else {
            alert('Failed to resize image.');
        }
    };

    return (
        <div className="p-5">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width" />
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" />
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
            </select>
            <button onClick={handleResize}>Resize Image</button>

            {downloadLink && (
                <div>
                    <a href={downloadLink} download>Download Resized Image</a>
                </div>
            )}
        </div>
    );
}

export default Resize