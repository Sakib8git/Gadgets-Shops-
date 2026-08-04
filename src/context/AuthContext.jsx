import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { isAdmin } from '../config/admins';
import useCartStore from '../store/cartStore';
import useSellerStore from '../store/sellerStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Clear cart when user logs out
      if (!firebaseUser) {
        useCartStore.getState().clearCart();
      }
      setUser(firebaseUser ?? null);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    useCartStore.getState().clearCart();   // clear immediately on explicit logout
    await signOut(auth);
  };

  const isSeller = user
    ? isAdmin(user) || useSellerStore.getState().isSeller(user.uid)
    : false;

  return (
    <AuthContext.Provider value={{
      user,
      loading: user === undefined,
      logout,
      admin:  isAdmin(user),
      seller: isSeller,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
