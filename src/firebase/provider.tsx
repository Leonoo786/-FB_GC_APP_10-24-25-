'use client';
import { createContext, useContext, ReactNode, FC } from 'react';
import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children: ReactNode;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({ firebaseApp, auth, firestore, children }) => {
  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, firestore }}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

export function useFirebaseApp(): FirebaseApp {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.firebaseApp;
}

export function useAuth(): Auth {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore(): Firestore {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}
