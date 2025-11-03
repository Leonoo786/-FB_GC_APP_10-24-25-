
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// The Firebase Admin SDK is available here:
// import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: "TODO: Your api key",
  authDomain: "TODO: Your auth domain",
  projectId: "TODO: Your project id",
  storageBucket: "TODO: Your storage bucket",
  messagingSenderId: "TODO: Your messaging sender id",
  appId: "TODO: Your app id",
};

export function getFirebaseConfig() {
    //
    if (!firebaseConfig || !firebaseConfig.apiKey) {
      throw new Error('No Firebase configuration object provided.' + '\n' +
      'Add your web app\'s configuration object to firebase-config.ts');
    } else {
      return firebaseConfig;
    }
}
