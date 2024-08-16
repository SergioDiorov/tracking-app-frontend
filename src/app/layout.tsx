import type { Metadata } from 'next';

import './globals.css';

import { TanstackProvider } from '@/providers/TanstackProvider';
import { Toaster } from '@/components/ui/sonner';

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
      <body className='bg-secondary'>
        <TanstackProvider>
          {children}
          <Toaster />
        </TanstackProvider>
      </body>
    </html>
  );
}
