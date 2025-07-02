// src/components/ProductImageGallery.jsx
"use client";
import { useState } from "react";

export default function ProductImageGallery({ images, alt }) {
  const [selected, setSelected] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* Main image container */}
      <div className="mb-4 w-full aspect-video bg-white flex items-center justify-center rounded-lg overflow-hidden">
        <img
          src={images[selected].url}
          alt={alt}
          className="h-full object-contain transition-shadow"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <button
            key={img.publicId}
            onClick={() => setSelected(idx)}
            className={`flex-shrink-0 w-24 h-24 bg-white flex items-center justify-center rounded-lg overflow-hidden border-2 ${
              idx === selected
                ? "border-purple-600"
                : "border-transparent hover:border-purple-300"
            }`}
          >
            <img
              src={img.url}
              alt={`Thumbnail ${idx + 1}`}
              className="h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
