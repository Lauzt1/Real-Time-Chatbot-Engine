import ProductCard from '.ProductCard'

export default function CategoryGrid({ products }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category Products</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
