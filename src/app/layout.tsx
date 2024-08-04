import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import './globals.css';

import { TanstackProvider } from '@/providers/TanstackProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HR Toolkit',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <TanstackProvider>
          {children}
          <Toaster />
        </TanstackProvider>
      </body>
    </html>
  );
}
