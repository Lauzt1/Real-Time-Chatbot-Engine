"use client";
import { useState } from "react";

export default function ProductImageGallery({ images, alt }) {
  const [selected, setSelected] = useState(0);
  // track which indexes should use contain vs cover
  const [useContain, setUseContain] = useState({});

  if (!images || images.length === 0) return null;

  // when a thumbnail loads, record if it's approximately square
  const onBigImageLoad = (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const ratio = w / h;
    // if within 10% of 1:1, treat as square
    setUseContain((prev) => ({
      ...prev,
      [selected]: ratio > 0.9 && ratio < 1.1,
    }));
  };

  return (
    <div>
      {/* Big image in a dark box */}
      <div className="mb-4 w-full aspect-video bg-white flex items-center justify-center rounded-lg overflow-hidden">
        <img
          src={images[selected].url}
          alt={alt}
          onLoad={onBigImageLoad}
          className={`w-full h-full ${
            useContain[selected] ? "object-contain" : "object-cover"
          } transition-shadow`}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={img.publicId}
            onClick={() => setSelected(idx)}
            className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 ${
              idx === selected
                ? "border-purple-600"
                : "border-transparent hover:border-purple-300"
            }`}
          >
            <img
              src={img.url}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
