import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_fxoQaIAi2iZZnC-Ow1H9v9fxsEi2jOk",
  authDomain: "my-shop-52e32.firebaseapp.com",
  projectId: "my-shop-52e32",
  storageBucket: "my-shop-52e32.firebasestorage.app",
  messagingSenderId: "901422994221",
  appId: "1:901422994221:web:00bbb1a1748e8a557f79a4",
  measurementId: "G-79QEBFW5VV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
