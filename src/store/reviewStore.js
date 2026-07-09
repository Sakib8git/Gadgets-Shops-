import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultTestimonials } from '../data/reviews';

const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: defaultTestimonials.map((r) => ({ ...r, _id: String(r.id) })),

      addReview: (review) => {
        const avatar = review.name
          .split(' ')
          .map((w) => w[0]?.toUpperCase() ?? '')
          .join('')
          .slice(0, 2);
        const newReview = {
          ...review,
          _id: String(Date.now()),
          id: Date.now(),
          avatar,
          role: 'Verified Buyer',
          createdAt: new Date().toISOString(),
        };
        set({ reviews: [newReview, ...get().reviews] });
        return newReview;
      },

      removeReview: (id) => {
        set({ reviews: get().reviews.filter((r) => r._id !== id && String(r.id) !== id) });
      },
    }),
    { name: 'myshop-reviews' }
  )
);

export default useReviewStore;
