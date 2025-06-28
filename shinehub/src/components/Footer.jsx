import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-3 bg-purple-200 py-3 text-gray-800 text-sm">
      <div className="container mx-auto mt-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div>
          <h3 className="font-semibold mb-2">Product Category</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/product/polisher" className="hover:underline">
                Polisher
              </Link>
            </li>
            <li>
              <Link href="/product/pad" className="hover:underline">
                Polishing Pad
              </Link>
            </li>
            <li>
              <Link href="/product/compound" className="hover:underline">
                Compounds
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Find Us</h3>
          <p>+6 012-345 6789</p>
          <p>shinehub@gmail.com</p>
          <p>Persiaran Multimedia, 63100 Cyberjaya, Selangor</p>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p>Copyright © 2025 MMU (FYP02-SE-T2510-0041 & FYP02-SE-T2510-0046)</p>
      </div>
    </footer>
  )
}
