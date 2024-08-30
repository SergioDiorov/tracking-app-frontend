'use client';

//React
import React from 'react';

//Providers
import { ReduxProvider } from '@/providers/ReduxProvider';
import { PublicProvider } from '@/providers/PublicProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <PublicProvider>{children}</PublicProvider>
    </ReduxProvider>
  );
}
