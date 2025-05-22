'use client'
import clsx from 'clsx'

export default function CategorySidebar({ categories, selected, onSelect }) {
  return (
    <aside className="w-1/4 pr-4">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.key}>
            <button
              onClick={() => onSelect(cat.key)}
              className={clsx(
                'text-left w-full px-2 py-1 rounded-md',
                selected === cat.key
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-purple-100'
              )}
            >
              {cat.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
