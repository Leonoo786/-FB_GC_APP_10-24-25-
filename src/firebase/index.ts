
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';
import { useUser } from './auth/use-user';
import {
  useFirebaseApp,
  useFirestore,
  useAuth,
  FirebaseProvider,
} from './provider';
import { FirebaseClientProvider } from './client-provider';

function initializeFirebase() {
  const firebaseConfig = getFirebaseConfig();

  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  } else {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  }
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
