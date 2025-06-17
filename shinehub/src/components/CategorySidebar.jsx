// components/admin/CategorySidebar.jsx
import Link from 'next/link'
import React from 'react'

const categories = [
  { name: 'Polishers', slug: 'polisher' },
  { name: 'Pads',      slug: 'pad' },
  { name: 'Compounds', slug: 'compound' },
]

export default function CategorySidebar({ active }) {
  return (
    <aside className="w-48 bg-purple-200 p-4">
      <h2 className="text-purple-700 text-lg font-medium mb-4">Products</h2>
      <ul className="space-y-2">
        {categories.map((cat) => {
          const isActive = cat.slug === active
          return (
            <li key={cat.slug}>
              <Link
                href={`/product/${cat.slug}`}
                className={`
                  block w-full text-center py-2 rounded
                  transition-colors
                  ${isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-purple-700 hover:bg-purple-300'}
                `}
              >
                {cat.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
