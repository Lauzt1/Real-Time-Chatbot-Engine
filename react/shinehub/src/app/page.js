import FeaturedProducts from '../components/FeaturedProducts'

// demo data for now
const featured = [
  { id: '1', name: 'Random Orbital Polisher', imageUrl: '/polisher1.jpg' },
  { id: '2', name: 'Random Orbital Polisher', imageUrl: '/polisher2.jpg' },
]

export default function HomePage() {
  return <FeaturedProducts products={featured} />
}
