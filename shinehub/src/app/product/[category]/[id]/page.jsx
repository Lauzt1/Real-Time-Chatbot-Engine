import CategorySidebar from '@/components/CategorySidebar'
import Polisher from '@/models/polisher'
import Pad       from '@/models/pad'
import Compound  from '@/models/compound'

async function getItem(category, id) {
  switch (category) {
    case 'polisher':
      return Polisher.findById(id).lean()
    case 'pad':
      return Pad.findById(id).lean()
    case 'compound':
      return Compound.findById(id).lean()
    default:
      return null
  }
}

export default async function DetailPage({ params }) {
  const { category, id } = params
  const item = await getItem(category, id)

  if (!item) {
    return <p className="p-6">Item not found</p>
  }

  return (
    <div className="flex">
      <CategorySidebar active={category} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">{item.name}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4">
            {item.images.map((img) => (
              <img
                key={img.publicId}
                src={img.url}
                alt={item.name}
                className="w-48 h-48 object-cover rounded"
              />
            ))}
          </div>

          <div className="flex-1">
            <dl className="space-y-2">
              {category === 'polisher' && (
                <>
                  <dt>Backing Pad:</dt><dd>{item.backingpad}"</dd>
                  <dt>Orbit:</dt><dd>{item.orbit} mm</dd>
                  <dt>Power:</dt><dd>{item.power} W</dd>
                  <dt>R.P.M.:</dt><dd>{item.power}</dd>
                  <dt>Weight:</dt><dd>{item.power} kg</dd>
                </>
              )}

              {category === 'pad' && (
                <>
                  <dt>Code:</dt><dd>{item.code}</dd>
                  <dt>Size:</dt><dd>{item.size}</dd>
                  <dt>Colour:</dt><dd>{item.colour}</dd>
                </>
              )}

              {category === 'compound' && (
                <>
                  <dt>Code:</dt><dd>{item.code}</dd>
                  <dt>Size:</dt><dd>{item.size}</dd>
                </>
              )}

              <dt>Description</dt>
              <dd>{item.description}</dd>
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
}
