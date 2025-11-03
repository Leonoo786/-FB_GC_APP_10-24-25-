'use client';

import {
  type ReactNode,
  useState,
  useEffect,
  FC,
} from 'react';
import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
}

export const FirebaseClientProvider: FC<FirebaseClientProviderProps> = ({
  firebaseApp,
  auth,
  firestore,
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
};
