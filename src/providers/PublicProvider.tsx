'use client';

// react
import { useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector, useAuth } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import { setUserData } from '@/redux/user/userSlice';

// next
import { useRouter } from 'next/navigation';

// api
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users/usersApi';

// components
import { Loader } from '@/components/ui/loader';

export function PublicProvider({ children }: { children: React.ReactNode }) {
  const isAuth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSelectors.getUserId);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['getUserById'],
    queryFn: () => usersApi.getUserById(userId),
    select: (res) => res.data.data,
    enabled: !!userId,
  });

  const isAuthWithProfile = isAuth && userId && data && isSuccess;

  useEffect(() => {
    if (data) dispatch(setUserData(data.profile));
  }, [data]);

  useEffect(() => {
    if (isAuthWithProfile) {
      router.push('/');
    }
  }, [isAuthWithProfile, router]);

  if (isLoading) {
    return <Loader full />;
  }

  if (!isAuth || !isAuthWithProfile) {
    return <>{children}</>;
  }

  return null;
}
