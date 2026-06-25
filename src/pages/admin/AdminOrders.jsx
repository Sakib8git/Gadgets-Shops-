import DashboardLayout from '../../components/DashboardLayout';
import { products as localProducts } from '../../data/products';

// Simulated orders from local product data
const mockOrders = localProducts.map((p, i) => ({
  id: `ORD-${1000 + i}`,
  product: p,
  qty: Math.ceil(Math.random() * 3 + 1) | 0 || 1,
  status: ['Delivered', 'Processing', 'Shipped', 'Pending'][i % 4],
  date: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString(),
  total: p.price,
}));

const statusColor = {
  Delivered:  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Processing: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Shipped:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Pending:    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

export default function AdminOrders() {
  const total = mockOrders.reduce((s, o) => s + o.total, 0);

  return (
    <DashboardLayout type="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {mockOrders.length} orders · total ${total.toFixed(2)}
          </p>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {['Delivered', 'Shipped', 'Processing', 'Pending'].map((s) => {
            const count = mockOrders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                <span className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[s]}`}>{s}</span>
              </div>
            );
          })}
        </div>

        {/* Orders table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {mockOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{o.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img src={o.product.image} alt={o.product.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[160px]">{o.product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{o.date}</td>
                    <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">${o.total.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
