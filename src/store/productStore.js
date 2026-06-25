import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as seedProducts } from '../data/products';

// Seed products normalised to have _id so the rest of the UI is consistent
const seed = seedProducts.map((p) => ({ ...p, _id: String(p.id) }));

const useProductStore = create(
  persist(
    (set, get) => ({
      products: seed,

      addProduct: (product) => {
        const newProduct = {
          ...product,
          id:      Date.now(),
          _id:     String(Date.now()),
          rating:  Number(product.rating)  || 0,
          reviews: Number(product.reviews) || 0,
          price:   Number(product.price),
        };
        set({ products: [newProduct, ...get().products] });
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p._id === id
              ? { ...p, ...updates, price: Number(updates.price), rating: Number(updates.rating) }
              : p
          ),
        });
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p._id !== id) });
      },

      // Reset back to the original seed data
      resetToSeed: () => set({ products: seed }),
    }),
    { name: 'myshop-products' }
  )
);

export default useProductStore;
