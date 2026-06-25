import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { defaultTestimonials } from '../../data/reviews';

export default function UserReviews() {
  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reviews</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Reviews you've submitted.</p>
          </div>
          <Link to="/feedback"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors">
            + Write Review
          </Link>
        </div>

        {defaultTestimonials.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
            <p className="text-4xl mb-3">✍️</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't written any reviews yet.</p>
            <Link to="/feedback" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
              Share your experience →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {defaultTestimonials.map((r) => (
              <div key={r.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{r.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 text-sm shrink-0">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">"{r.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
