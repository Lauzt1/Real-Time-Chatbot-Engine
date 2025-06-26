"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const categories = [
  { name: 'Polishers', slug: 'polisher' },
  { name: 'Pads', slug: 'pad' },
  { name: 'Compounds', slug: 'compound' },
];

const formatSlug = (str) => str.replace(/\s+/g, '_');

export default function CategorySidebar({ active }) {
  const [hovered, setHovered] = useState(null);
  const [typesMap, setTypesMap] = useState({});

  const handleMouseEnter = (slug) => {
    setHovered(slug);
    if (!typesMap[slug]) {
      fetch(`/api/${slug}/type`)
        .then((res) => res.json())
        .then((data) => {
          setTypesMap((prev) => ({ ...prev, [slug]: data.types }));
        })
        .catch((err) => console.error('Failed to load types', err));
    }
  };

  const handleMouseLeave = () => {
    setHovered(null);
  };

  return (
    <aside className="w-48 bg-purple-200 p-4">
      <h2 className="text-purple-700 text-lg font-medium mb-4">Product Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => {
          const isActive = cat.slug === active;
          const isHovered = cat.slug === hovered;
          const types = typesMap[cat.slug] || [];
          return (
            <li
              key={cat.slug}
              onMouseEnter={() => handleMouseEnter(cat.slug)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={`/admin/productManagement/${cat.slug}`}
                className={`block w-full text-center py-2 rounded transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-300'
                }`}
              >
                {cat.name}
              </Link>

              {isHovered && types.length > 0 && (
                <ul className="mt-1 pl-4 space-y-1">
                  {types.map((type) => {
                    const slugifiedType = formatSlug(type);
                    return (
                      <li key={type}>
                        <Link
                          href={`/admin/productManagement/${cat.slug}/type/${slugifiedType}`}
                          className="block py-1 hover:text-purple-600"
                        >
                          {type}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
