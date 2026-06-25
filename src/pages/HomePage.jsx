import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, getReviews } from '../api/client';

function Stars({ rating, size = 'sm' }) {
  const cls = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg"
          className={`${cls} ${s <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    title: 'Free Shipping', desc: 'On all orders over $50. No hidden fees, ever.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Secure Payments', desc: 'Your payment info is always safe with us.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    title: 'Easy Returns', desc: '30-day hassle-free return policy on everything.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    title: '24/7 Support', desc: 'Real humans ready to help, any time of day.',
  },
];

const categoryCards = [
  { label: 'Electronics', color: 'from-blue-500 to-indigo-600',    emoji: '🎧' },
  { label: 'Clothing',    color: 'from-pink-500 to-rose-500',      emoji: '👕' },
  { label: 'Sports',      color: 'from-green-500 to-emerald-600',  emoji: '🏋️' },
  { label: 'Bags',        color: 'from-amber-500 to-orange-500',   emoji: '🎒' },
  { label: 'Footwear',    color: 'from-purple-500 to-violet-600',  emoji: '👟' },
  { label: 'Accessories', color: 'from-teal-500 to-cyan-600',      emoji: '🕶️' },
];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const searchQuery = searchParams.get('search') || '';

  // API state
  const [allProducts, setAllProducts]       = useState([]);
  const [categories, setCategories]         = useState(['All']);
  const [testimonials, setTestimonials]     = useState([]);
  const [heroProducts, setHeroProducts]     = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products whenever filters / search change
  useEffect(() => {
    setLoadingProducts(true);
    getProducts({
      search: searchQuery || undefined,
      category: activeCategory !== 'All' ? activeCategory : undefined,
      sort: sortBy !== 'default' ? sortBy : undefined,
    })
      .then(({ products }) => setAllProducts(products))
      .catch(() => setAllProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [searchQuery, activeCategory, sortBy]);

  // Fetch hero preview products and reviews once
  useEffect(() => {
    getProducts({ limit: 4 })
      .then(({ products }) => setHeroProducts(products))
      .catch(() => {});
    getReviews()
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  const featuredProducts = useMemo(
    () => allProducts.filter((p) => p.rating >= 4.5).slice(0, 4),
    [allProducts]
  );

  if (searchQuery) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Search results for <span className="text-indigo-600 dark:text-indigo-400">"{searchQuery}"</span>
          <span className="ml-2 text-sm text-gray-400 dark:text-gray-500">({allProducts.length} items)</span>
        </h2>
        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </main>
    );
  }

  return (
    <main>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              New arrivals every week
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Shop What <br /><span className="text-yellow-300">You Love</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-md mb-10 leading-relaxed">
              Discover thousands of top-quality products at unbeatable prices. Fast shipping, easy returns, and 24/7 support.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/products" className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-50 transition-colors shadow-lg">
                Shop Now
              </Link>
              <Link to="/products" className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors">
                Browse Categories
              </Link>
            </div>
            <div className="flex gap-8 mt-12 justify-center md:justify-start">
              {[['10K+', 'Happy Customers'], ['500+', 'Products'], ['99%', 'Satisfaction']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-extrabold">{num}</div>
                  <div className="text-xs text-indigo-200 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm w-full">
            {heroProducts.slice(0, 4).map((p, i) => (
              <Link key={p._id} to={`/products/${p._id}`} className={`rounded-2xl overflow-hidden shadow-xl ${i === 0 ? 'row-span-2' : ''}`}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  style={{ height: i === 0 ? '260px' : '124px' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => (
            <Link key={cat.label} to="/products"
              className={`group bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center text-white shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <div className="font-semibold text-sm">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Our top-rated picks just for you</p>
            </div>
            <Link to="/products" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/products" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
              View all products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Products</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Browse our full collection</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                {cat}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Sort products">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        {loadingProducts ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <p className="text-lg font-medium">No products found</p>
            <button onClick={() => setActiveCategory('All')} className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm underline">
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────────────── */}
      <section className="mx-4 md:mx-8 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-pink-500 text-white my-8">
        <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-100 mb-2">Limited time offer</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">Get 20% Off Your First Order</h2>
            <p className="text-orange-100 mt-2 text-sm">
              Use code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">WELCOME20</span> at checkout
            </p>
          </div>
          <Link to="/products" className="shrink-0 bg-white text-orange-600 font-bold px-8 py-3.5 rounded-full hover:bg-orange-50 transition-colors shadow-lg">
            Claim Offer
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="bg-indigo-50 dark:bg-indigo-950/30 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold uppercase tracking-widest">What people say</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Customer Reviews</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Real feedback from real shoppers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((t) => (
              <article key={t._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-gray-700 flex flex-col gap-4">
                <svg className="h-8 w-8 text-indigo-200 dark:text-indigo-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 text-sm">"{t.message}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {t.role} · {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : t.date}
                    </div>
                  </div>
                  <Stars rating={t.rating} />
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Had a great experience? We'd love to hear from you.</p>
            <Link to="/feedback" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow">
              Leave a Review
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
