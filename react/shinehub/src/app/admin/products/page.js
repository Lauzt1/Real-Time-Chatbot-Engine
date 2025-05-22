// src/app/admin/products/page.js
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Products'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  await dbConnect()
  const products = await Product.find().lean()
  // serialize Mongo ObjectIds
  const data = JSON.parse(JSON.stringify(products))

  return <ProductsClient initialProducts={data} />
}
