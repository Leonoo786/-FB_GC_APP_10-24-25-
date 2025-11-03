
'use client';

import { useState, useEffect } from 'react';
import type {
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useMemoFirebase } from './use-memo-firebase';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const memoizedRef = useMemoFirebase(ref);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!memoizedRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const docData = { id: snapshot.id, ...snapshot.data() } as T;
          setData(docData);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const permissionError = new FirestorePermissionError({
            path: memoizedRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, loading, error };
}
