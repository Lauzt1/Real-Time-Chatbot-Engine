'use client'

import { useState } from 'react'
import CategorySidebar from '@/components/CategorySidebar'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = [
  { key: 'polishers',    label: 'Polishers' },
  { key: 'polishing-pads', label: 'Polishing Pads' },
  { key: 'compounds',    label: 'Compounds' },
]

export default function ProductsClient({ products }) {
  const [category, setCategory] = useState('polishers')
  const filtered = products.filter((p) => p.category === category)

  return (
    <div className="container mx-auto px-4 flex">
      <CategorySidebar
        categories={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />

      <div className="flex-1">
        <h1 className="text-3xl font-bold uppercase mb-6">
          {CATEGORIES.find((c) => c.key === category).label}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
