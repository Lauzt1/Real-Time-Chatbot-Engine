// scripts/seed.js
import 'dotenv/config';        // <-- this will read .env.local into process.env
import dbConnect from '../src/lib/mongoose.js';
import Product from '../src/models/Products.js';

// …rest of your seed() code

async function seed() {
  await dbConnect()

  // 1) Clear out old data (optional)
  await Product.deleteMany({})

  // 2) Create fresh products
  await Product.create([
      {
    name:        'LHR21 MarkV',
    backingpadinch: 6,
    orbitmm:       21,
    powerw:        500,
    rpm:           '3000–4500',
    weightkg:      2.44,
    imageUrl:      '/images/LHR21-MarkV.jpg',
    category:    'polishers'
  },
  {
    name:        'LHR15 MarkV',
    backingpadinch: 5,
    orbitmm:       15,
    powerw:        500,
    rpm:           '3000–5200',
    weightkg:      2.35,
    imageUrl:      '/images/LHR15-MarkV.jpg',
    category:    'polishers'
  },
  {
    name:        'LHR21 MarkIII',
    backingpadinch: 6,
    orbitmm:       21,
    powerw:        500,
    rpm:           '3000–4500',
    weightkg:      2.7,
    imageUrl:      '/images/LHR21-MarkIII.jpg',
    category:    'polishers'
  },
  {
    name:        'LHR15 MarkIII',
    backingpadinch: 5,
    orbitmm:       15,
    powerw:        500,
    rpm:           '3000–5200',
    weightkg:      2.6,
    imageUrl:      '/images/LHR15-MarkV.jpg',
    category:    'polishers'
  },
  {
    name:        'LHR21ES',
    backingpadinch: 6,
    orbitmm:       21,
    powerw:        500,
    rpm:           '2000–4200',
    weightkg:      2.6,
    imageUrl:      '/images/LHR21ES.jpg',
    category:    'polishers'
  },
  {
    name:        'LHR15ES',
    backingpadinch: 5,
    orbitmm:       15,
    powerw:        500,
    rpm:           '2000–5000',
    weightkg:      2.5,
    imageUrl:      '/images/LHR15ES.jpg',
    category:    'polishers'
  },
  {
    name:        'LH19E',
    backingpadinch: 8,
    orbitmm:       12,
    powerw:        210,
    rpm:           '2000-4000',
    weightkg:      '2.5',
    imageUrl:      '/images/LH19E.jpg',
    category:    'polishers'
  }
  ])

  console.log('✅ Seed complete')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})