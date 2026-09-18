import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Firebase Client Configuration
// Reads from Vite environment variables (VITE_FIREBASE_*)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyHyderabadDarbar2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hyderabad-darbar-restro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hyderabad-darbar-restro',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hyderabad-darbar-restro.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '102938475610',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:102938475610:web:8f9a0b1c2d3e4f5a6b7c8d'
};

// Initialize Firebase App instance singleton
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

export default app;
