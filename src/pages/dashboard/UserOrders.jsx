import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useCartStore from '../../store/cartStore';

export default function UserOrders() {
  const items = useCartStore((s) => s.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Items currently in your cart / pending order.
        </p>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet.</p>
            <Link to="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              {/* Order header */}
              <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pending Order</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {items.length} item{items.length !== 1 ? 's' : ''} · {new Date().toLocaleDateString()}
                  </p>
                </div>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                  In Cart
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-4 px-6 py-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">×{item.quantity} @ ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <p className="font-bold text-gray-800 dark:text-gray-200">Total</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${total.toFixed(2)}</p>
              </div>
            </div>

            <Link to="/cart"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full transition-colors">
              Go to Checkout →
            </Link>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
