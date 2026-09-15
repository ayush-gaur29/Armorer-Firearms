import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import type { Analytics } from "firebase/analytics";
import type { Database } from "firebase/database";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDoHnNZU2zdR63bwhbl07EBPbHtbATo8K0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "highland-firearms.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "highland-firearms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "highland-firearms.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "960225337027",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:960225337027:web:0c3e9e44bb1294b1910c76",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BLQV544D7L",
};

// Initialize Firebase App
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
export const db: Firestore = getFirestore(app);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Firebase Analytics safely (client-only)
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  import("firebase/analytics")
    .then(({ isSupported, getAnalytics }) =>
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }),
    )
    .catch(() => undefined);
}

// Lazy Realtime Database accessor (for Realtime Database usage if needed)
let rtdbInstance: Database | null = null;
export async function getRealtimeDb(): Promise<Database> {
  if (!rtdbInstance) {
    const { getDatabase } = await import("firebase/database");
    rtdbInstance = getDatabase(app);
  }
  return rtdbInstance;
}

// Backward-compatible promise-based getters for existing hooks and components
export async function getFirebaseApp(): Promise<FirebaseApp> {
  return app;
}

export async function getDb(): Promise<Firestore> {
  return db;
}

export async function getFirebaseAuth(): Promise<Auth> {
  return auth;
}
