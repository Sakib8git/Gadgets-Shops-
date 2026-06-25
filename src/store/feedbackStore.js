import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    avatar: 'SJ',
    rating: 5,
    message:
      'Absolutely love shopping here! The products are high quality and shipping was super fast. Will definitely be ordering again.',
    date: '2026-06-10',
  },
  {
    id: 2,
    name: 'Marcus Lee',
    role: 'Verified Buyer',
    avatar: 'ML',
    rating: 5,
    message:
      'Great selection and really competitive prices. The smart watch I bought exceeded my expectations. Highly recommend!',
    date: '2026-06-15',
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Verified Buyer',
    avatar: 'PP',
    rating: 4,
    message:
      'Really smooth checkout experience and the product descriptions are accurate. My yoga mat arrived in perfect condition.',
    date: '2026-06-18',
  },
];

const useFeedbackStore = create(
  persist(
    (set, get) => ({
      testimonials: defaultTestimonials,

      addTestimonial: (feedback) => {
        const newItem = {
          ...feedback,
          id: Date.now(),
          role: 'Verified Buyer',
          avatar: feedback.name
            .split(' ')
            .map((w) => w[0].toUpperCase())
            .join('')
            .slice(0, 2),
          date: new Date().toISOString().split('T')[0],
        };
        set({ testimonials: [newItem, ...get().testimonials] });
      },
    }),
    {
      name: 'myshop-feedback',
    }
  )
);

export default useFeedbackStore;
