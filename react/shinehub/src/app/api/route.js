import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Product'

export async function GET() {
  await dbConnect()
  const products = await Product.find()
  return NextResponse.json(products)
}

export async function POST(req) {
  await dbConnect()
  const data = await req.json()
  const newP = await Product.create(data)
  return NextResponse.json(newP, { status: 201 })
}
