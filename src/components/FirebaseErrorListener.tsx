'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: FirestorePermissionError) => {
      // In a real app, you might use a toast notification library
      // and log the full error to an error reporting service.
      console.error('Firestore Permission Error:', error.message);
      
      // Throwing the error here will cause it to be caught by Next.js's
      // development error overlay. This is useful for debugging.
      // In production, you'll want to handle this more gracefully.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handler);

    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return null; // This component does not render anything
}
