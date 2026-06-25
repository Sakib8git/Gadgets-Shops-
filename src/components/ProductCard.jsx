import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/products/${product._id}`} className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
          {product.category}
        </span>

        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
          {product.description}
        </p>

        <StarRating rating={product.rating} />

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
