import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useCartStore from '../../store/cartStore';
import { localProducts } from '../../data/products';

// Simple wishlist — top rated products as suggestions
export default function UserWishlist() {
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);
  const cartIds = new Set(cartItems.map((i) => String(i._id || i.id)));

  const suggested = [...localProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map((p) => ({ ...p, _id: String(p.id) }));

  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wishlist</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Our top-rated picks you might love.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggested.map((p) => {
            const inCart = cartIds.has(String(p._id));
            return (
              <div key={p._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <Link to={`/products/${p._id}`}>
                  <img src={p.image} alt={p.name} className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <span className="text-xs font-medium text-indigo-500 uppercase tracking-wide">{p.category}</span>
                  <Link to={`/products/${p._id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    {'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}
                    <span className="text-xs text-gray-400 ml-1">({p.rating})</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-gray-900 dark:text-white">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(p)}
                      disabled={inCart}
                      className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                        inCart
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {inCart ? '✓ In Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
