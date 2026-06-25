import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { defaultTestimonials } from '../../data/reviews';

export default function AdminReviews() {
  const [reviews, setReviews] = useState(defaultTestimonials);
  const [filter, setFilter]   = useState('All');

  const filtered = filter === 'All'
    ? reviews
    : reviews.filter((r) => r.rating === Number(filter));

  const remove = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <DashboardLayout type="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {reviews.length} reviews · avg rating {avgRating} ★
          </p>
        </div>

        {/* Rating filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', '5', '4', '3', '2', '1'].map((v) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === v
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
              }`}>
              {v === 'All' ? 'All' : `${'★'.repeat(Number(v))} ${v}`}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{r.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {r.role} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <button onClick={() => remove(r.id)}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">"{r.message}"</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              No reviews for this rating.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
