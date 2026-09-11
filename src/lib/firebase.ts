// Firebase is loaded lazily and only in the browser so SSR stays clean.
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDoHnNZU2zdR63bwhbl07EBPbHtbATo8K0",
  authDomain: "highland-firearms.firebaseapp.com",
  projectId: "highland-firearms",
  storageBucket: "highland-firearms.firebasestorage.app",
  messagingSenderId: "960225337027",
  appId: "1:960225337027:web:0c3e9e44bb1294b1910c76",
  measurementId: "G-BLQV544D7L",
};

let appPromise: Promise<FirebaseApp> | null = null;
let dbPromise: Promise<Firestore> | null = null;
let authPromise: Promise<Auth> | null = null;

export function getFirebaseApp() {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) => {
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      if (typeof window !== "undefined") {
        import("firebase/analytics")
          .then(({ isSupported, getAnalytics }) => isSupported().then((ok) => ok && getAnalytics(app)))
          .catch(() => undefined);
      }
      return app;
    });
  }
  return appPromise;
}

export function getDb() {
  if (!dbPromise) {
    dbPromise = Promise.all([getFirebaseApp(), import("firebase/firestore")]).then(
      ([app, { getFirestore }]) => getFirestore(app),
    );
  }
  return dbPromise;
}

export function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = Promise.all([getFirebaseApp(), import("firebase/auth")]).then(
      ([app, { getAuth }]) => getAuth(app),
    );
  }
  return authPromise;
}
