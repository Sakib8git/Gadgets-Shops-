import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M9 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Your Cart <span className="text-gray-400 dark:text-gray-500 text-lg font-normal">({totalItems} items)</span>
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 underline">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col gap-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                <span className="text-xs text-indigo-500 dark:text-indigo-400">{item.category}</span>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">${item.price.toFixed(2)}</p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Decrease quantity">−</button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center text-gray-800 dark:text-gray-100">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Increase quantity">+</button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">= ${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)}
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove ${item.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 h-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span><span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span><span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full transition-colors">
            Checkout
          </button>
          <Link to="/products" className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4">
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
