// src/app/products/page.js
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Products'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  await dbConnect()
  const products = await Product.find().lean()

  return <ProductsClient products={JSON.parse(JSON.stringify(products))} />
}
