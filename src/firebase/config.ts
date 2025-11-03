
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// The Firebase Admin SDK is available here:
// import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "studio-8302502127-557bf",
  "appId": "1:259840996333:web:7de21ed4a3798cea26ade4",
  "apiKey": "AIzaSyA3VW-0Eb5eD1zl5iTV7JA-Lbf6NaDdNjY",
  "authDomain": "studio-8302502127-557bf.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "259840996333"
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
