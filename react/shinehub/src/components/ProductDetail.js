/* eslint-disable @next/next/no-img-element */
// src/components/ProductDetail.js
'use client'
import Link from 'next/link'

export default function ProductDetail({ product }) {
  return (
    <div className="max-w-4xl mx-auto lg:flex gap-8 p-6 bg-white rounded-lg shadow">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full lg:w-1/2 h-auto object-cover rounded"
      />
      <div className="mt-4 lg:mt-0 flex-1">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <p className="mt-4 text-xl font-semibold">${product.price.toFixed(2)}</p>
        <Link href={`/enquiry/${product.id}`}>
          <button className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Send Enquiry
          </button>
        </Link>
      </div>
    </div>
  )
}
