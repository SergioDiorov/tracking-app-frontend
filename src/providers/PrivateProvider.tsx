'use client';

// next
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// redux
import { useAuth } from '@/redux/hooks';

export function PrivateProvider({ children }: { children: React.ReactNode }) {
  const isAuth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push('/signIn');
    }
  }, [isAuth, router]);

  if (typeof window !== 'undefined' && !isAuth) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
