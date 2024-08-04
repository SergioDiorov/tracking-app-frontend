// Redux
import { useAppSelector, useAuth } from '@/redux/hooks';
import { useEffect } from 'react';
import userSelectors from '@/redux/user/userSelectors';

// Next
import { useRouter } from 'next/navigation';

export function PublicProvider({ children }: { children: React.ReactNode }) {
  const isAuth = useAuth();
  const userId = useAppSelector(userSelectors.getUserId);

  const router = useRouter();

  // todo save fetch and save used profile data

  const isAuthWithProfile = isAuth && userId;
  useEffect(() => {
    if (isAuthWithProfile) {
      router.push('/');
    }
  }, [isAuthWithProfile, router]);

  if (!isAuth || !isAuthWithProfile) {
    return <>{children}</>;
  }

  return null;
}
