import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Review from './models/Review.js';

const products = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    description: 'Premium sound quality with active noise cancellation.',
    rating: 4.5,
    reviews: 128,
  },
  {
    name: 'Running Sneakers',
    price: 59.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    description: 'Lightweight and breathable for your daily runs.',
    rating: 4.3,
    reviews: 95,
  },
  {
    name: 'Leather Backpack',
    price: 129.99,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    description: 'Genuine leather with multiple compartments.',
    rating: 4.7,
    reviews: 74,
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    description: 'Track your fitness and stay connected.',
    rating: 4.6,
    reviews: 210,
  },
  {
    name: 'Sunglasses',
    price: 34.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    description: 'UV400 protection with polarized lenses.',
    rating: 4.2,
    reviews: 56,
  },
  {
    name: 'Cotton T-Shirt',
    price: 24.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    description: '100% organic cotton, available in multiple colors.',
    rating: 4.4,
    reviews: 183,
  },
  {
    name: 'Desk Lamp',
    price: 44.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    description: 'LED lamp with adjustable brightness and color temperature.',
    rating: 4.1,
    reviews: 42,
  },
  {
    name: 'Yoga Mat',
    price: 39.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&q=80',
    description: 'Non-slip surface, extra thick for joint support.',
    rating: 4.8,
    reviews: 319,
  },
];

const reviews = [
  {
    name: 'Sarah Johnson',
    avatar: 'SJ',
    rating: 5,
    message: 'Absolutely love shopping here! The products are high quality and shipping was super fast. Will definitely be ordering again.',
  },
  {
    name: 'Marcus Lee',
    avatar: 'ML',
    rating: 5,
    message: 'Great selection and really competitive prices. The smart watch I bought exceeded my expectations. Highly recommend!',
  },
  {
    name: 'Priya Patel',
    avatar: 'PP',
    rating: 4,
    message: 'Really smooth checkout experience and the product descriptions are accurate. My yoga mat arrived in perfect condition.',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany();
    await Review.deleteMany();
    console.log('🗑️  Cleared existing data');

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    const insertedReviews = await Review.insertMany(reviews);
    console.log(`✅ Seeded ${insertedReviews.length} reviews`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
