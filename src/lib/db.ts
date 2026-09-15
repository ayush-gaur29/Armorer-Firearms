import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type Unsubscribe,
  type SetOptions,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export { db };

/**
 * Fetch a single document by ID from a Firestore collection.
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, docId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}

/**
 * Fetch all documents in a collection, optionally filtered/sorted with query constraints.
 */
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<Array<T & { id: string }>> {
  const colRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
}

/**
 * Add a new document with auto-generated ID to a collection.
 * Automatically attaches createdAt and updatedAt server timestamps.
 */
export async function addDocument<T extends Record<string, any>>(
  collectionName: string,
  data: T,
): Promise<string> {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Set or overwrite a document with a specific ID.
 */
export async function setDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T,
  options: SetOptions = { merge: true },
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    options,
  );
}

/**
 * Update specific fields on an existing document.
 */
export async function updateDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a document from a collection.
 */
export async function deleteDocument(
  collectionName: string,
  docId: string,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

/**
 * Listen to real-time changes on a single document.
 * Returns an unsubscribe callback.
 */
export function subscribeDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  onData: (doc: (T & { id: string }) | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
      } else {
        onData({ id: snap.id, ...(snap.data() as T) });
      }
    },
    onError,
  );
}

/**
 * Listen to real-time changes on a collection with optional query constraints.
 * Returns an unsubscribe callback.
 */
export function subscribeCollection<T = DocumentData>(
  collectionName: string,
  onData: (items: Array<T & { id: string }>) => void,
  onError?: (err: Error) => void,
  ...constraints: QueryConstraint[]
): Unsubscribe {
  const colRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }));
      onData(items);
    },
    onError,
  );
}
