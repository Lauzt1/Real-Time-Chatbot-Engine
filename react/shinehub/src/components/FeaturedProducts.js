// this can be a server or client component
import ProductCard from './ProductCard'

export default function FeaturedProducts({ products }) {
  return (
    <section className="space-y-4">
      <h2 className="text-4xl font-bold text-center uppercase">
        Featured Products
      </h2>
      <hr className="border-t-2 border-gray-300" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
