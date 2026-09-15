import { useEffect, useState } from "react";
import { type QueryConstraint } from "firebase/firestore";
import { subscribeCollection, subscribeDocument } from "@/lib/db";

/**
 * React hook to subscribe to a single Firestore document in real time.
 */
export function useFirestoreDocument<T>(collectionName: string, docId: string | undefined | null) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(docId));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeDocument<T>(
      collectionName,
      docId,
      (doc) => {
        setData(doc);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

/**
 * React hook to subscribe to a Firestore collection in real time.
 */
export function useFirestoreCollection<T>(collectionName: string, ...constraints: QueryConstraint[]) {
  const [data, setData] = useState<Array<T & { id: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeCollection<T>(
      collectionName,
      (items) => {
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
      ...constraints,
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error };
}
