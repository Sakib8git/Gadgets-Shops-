import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">MyShop</h3>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for quality products at great prices.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            <li><Link to="/feedback" className="hover:text-white transition-colors">Leave a Review</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><span className="cursor-default">FAQ</span></li>
            <li><span className="cursor-default">Shipping Policy</span></li>
            <li><span className="cursor-default">Returns</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-gray-700 text-center text-xs py-4 text-gray-600">
        © {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
}
