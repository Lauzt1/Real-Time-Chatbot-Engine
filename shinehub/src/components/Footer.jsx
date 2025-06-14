import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-purple-200 py-8 text-gray-800 text-sm">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div>
          <h3 className="font-semibold mb-2">Products</h3>
          <ul className="space-y-1">
            <Link href={`/product/polisher`}><li>Polisher</li></Link>
            <li>Polishing Pads</li>
            <li>Compounds</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Find Us</h3>
          <p>+6 012-345 6789</p>
          <p>shinehub@gmail.com</p>
          <p>Persiaran Multimedia, 63100 Cyberjaya, Selangor</p>
        </div>
        <div>
          <Link href={`/admin`}>
            <h3 className="font-semibold mb-2">Admin</h3>
          </Link>
        </div>
      </div>
    </footer>
  )
}