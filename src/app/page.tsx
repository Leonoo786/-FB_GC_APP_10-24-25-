
'use client';
import { useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      // If not loading and no user, sign in anonymously.
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Render a loading state while checking auth status.
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
