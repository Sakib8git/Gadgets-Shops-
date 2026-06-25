import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import { getProductById, getProducts } from '../api/client';

export default function ProductDetailPage() {
  const { id } = useParams();
  const addToCart = useCartStore((s) => s.addToCart);

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProductById(id)
      .then((p) => {
        setProduct(p);
        // Fetch related products from same category
        return getProducts({ category: p.category });
      })
      .then(({ products }) => {
        setRelated(products.filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="text-center py-32 text-gray-500 dark:text-gray-400">
        <p className="text-2xl font-semibold mb-4">Product not found</p>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 dark:text-gray-200">{product.name}</span>
      </nav>

      {/* Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={product.image} alt={product.name} className="w-full h-96 object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2">
            <div className="flex" aria-label={`Rating: ${product.rating}`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors w-full md:w-auto"
          >
            Add to Cart
          </button>

          <Link to="/cart" className="text-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
            View Cart →
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
