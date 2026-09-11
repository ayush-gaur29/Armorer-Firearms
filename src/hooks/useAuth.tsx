import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    Promise.all([getFirebaseAuth(), import("firebase/auth")])
      .then(([auth, fa]) => {
        unsub = fa.onAuthStateChanged(auth, (u) => {
          setUser(u);
          setReady(true);
        });
      })
      .catch(() => setReady(true));
    return () => unsub();
  }, []);

  const value: AuthState = {
    user,
    ready,
    async login(email, password) {
      const [auth, fa] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      await fa.signInWithEmailAndPassword(auth, email, password);
    },
    async signup(email, password, displayName) {
      const [auth, fa] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      const cred = await fa.createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await fa.updateProfile(cred.user, { displayName });
      setUser({ ...cred.user, displayName } as User);
    },
    async logout() {
      const [auth, fa] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      await fa.signOut(auth);
    },
    async updateName(displayName) {
      const [auth, fa] = await Promise.all([getFirebaseAuth(), import("firebase/auth")]);
      if (auth.currentUser) {
        await fa.updateProfile(auth.currentUser, { displayName });
        setUser({ ...auth.currentUser, displayName } as User);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function friendlyAuthError(err: unknown) {
  const code = (err as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/user-not-found": "No collector account exists for that email.",
    "auth/wrong-password": "The password is incorrect.",
    "auth/email-already-in-use": "An account already exists for that email.",
    "auth/weak-password": "Please choose a password of at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed": "Network unavailable. Please check your connection.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
