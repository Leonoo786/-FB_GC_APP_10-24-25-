
// This is a server component
import { FirebaseClientProvider } from '@/firebase';
import { AppStateProvider } from '@/context/app-state-context';
import AppLayoutClient from './app-layout-client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <FirebaseClientProvider>
        <AppStateProvider>
          <AppLayoutClient>{children}</AppLayoutClient>
        </AppStateProvider>
      </FirebaseClientProvider>
    );
}
