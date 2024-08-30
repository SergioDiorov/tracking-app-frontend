'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';

// redux
import { useAuth } from '@/redux/hooks';

// provider
import { ProfileProvider } from '@/providers/ProfileProvider';

export function PrivateProvider({ children }: { children: React.ReactNode }) {
  const isAuth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push('/signIn');
    }
  }, [isAuth, router]);

  if (typeof window !== 'undefined' && !isAuth) {
    return null;
  }

  return isAuth ? <ProfileProvider>{children}</ProfileProvider> : null;
}
