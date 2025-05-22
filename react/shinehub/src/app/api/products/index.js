import { connect } from '@/lib/mongoose';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connect();
  const products = await Product.find().lean();
  res.status(200).json(products);
}
