import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { AppStateProvider } from '@/context/app-state-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConstructAI',
  description: 'Construction Project Management Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseClientProvider>
          <ThemeProvider>
            <AppStateProvider>
              {children}
              <Toaster />
            </AppStateProvider>
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
