
'use client';

import { useState, useEffect } from 'react';
import type {
  Query,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useMemoFirebase } from './use-memo-firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(query: Query<T> | null) {
  const memoizedQuery = useMemoFirebase(query);
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedQuery) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedQuery.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading, error };
}

