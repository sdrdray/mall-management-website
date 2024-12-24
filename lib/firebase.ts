import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyALrLtHnJFUx36vEYusPmA0sst8KHXctT4",
  authDomain: "mall-app-196e1.firebaseapp.com",
  databaseURL: "https://mall-app-196e1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mall-app-196e1",
  storageBucket: "mall-app-196e1.firebasestorage.app",
  messagingSenderId: "331407749229",
  appId: "1:331407749229:web:38ac3c602e679e868fcf64",
  measurementId: "G-PY517NQD4Z"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Initialize Analytics only on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics, functions };

