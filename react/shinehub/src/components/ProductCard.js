// src/components/ProductCard.js
import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* only render Image if we have a non-empty URL */}
      {product.imageUrl ? (
        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      <div className="p-4 text-center">
        <h3 className="font-medium">{product.name}</h3>
      </div>
    </Link>
  )
}
