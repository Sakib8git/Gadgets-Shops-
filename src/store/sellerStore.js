import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Seller request store
 *
 * request shape:
 * {
 *   id:        string   (Date.now())
 *   uid:       string   (Firebase user uid)
 *   email:     string
 *   name:      string
 *   shopName:  string
 *   reason:    string
 *   status:    'pending' | 'approved' | 'rejected'
 *   createdAt: ISO string
 * }
 */

const useSellerStore = create(
  persist(
    (set, get) => ({
      requests: [],          // all seller requests
      approvedUids: [],      // uids that have been approved as sellers

      // ── User actions ──────────────────────────────────────────────────────

      submitRequest: ({ uid, email, name, shopName, reason }) => {
        // Only one pending/approved request per user
        const existing = get().requests.find((r) => r.uid === uid);
        if (existing) return existing;

        const req = {
          id: String(Date.now()),
          uid, email, name, shopName, reason,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set({ requests: [req, ...get().requests] });
        return req;
      },

      getRequestByUid: (uid) =>
        get().requests.find((r) => r.uid === uid) ?? null,

      // ── Admin actions ─────────────────────────────────────────────────────

      approveRequest: (id) => {
        const req = get().requests.find((r) => r.id === id);
        if (!req) return;
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, status: 'approved' } : r
          ),
          approvedUids: [...new Set([...get().approvedUids, req.uid])],
        });
      },

      rejectRequest: (id) => {
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, status: 'rejected' } : r
          ),
        });
      },

      // ── Helper ────────────────────────────────────────────────────────────

      isSeller: (uid) => get().approvedUids.includes(uid),
    }),
    { name: 'myshop-sellers' }
  )
);

export default useSellerStore;
