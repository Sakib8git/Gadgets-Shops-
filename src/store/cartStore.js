import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Normalise the id — products from MongoDB use _id, local products use id.
const pid = (product) => String(product._id ?? product.id);

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const items = get().items;
        const key   = pid(product);
        const existing = items.find((i) => pid(i) === key);

        if (existing) {
          set({
            items: items.map((i) =>
              pid(i) === key ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((i) => pid(i) !== String(id)) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            pid(i) === String(id) ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'myshop-cart',   // localStorage key
    }
  )
);

export default useCartStore;
