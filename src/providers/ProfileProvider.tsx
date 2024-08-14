'use client';

// react
import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';

// redux
import { useAppDispatch, useAppSelector, useAuth } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import { setUserData } from '@/redux/user/userSlice';

// api
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users/usersApi';

// components
import { Loader } from '@/components/ui/loader';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = useAuth();
  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSelectors.getUserId);

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ['getUserById'],
    queryFn: () => usersApi.getUserById(userId),
    select: (res) => res.data.data,
    enabled: !!userId,
  });

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserData(data.profile));
      router.push('/');
    }

    if (isError && error) {
      !isAuth && router.push('/signIn');
    }
  }, [data, isAuth]);

  if (isLoading) {
    return <Loader full />;
  }

  return <> {isAuth && <>{children}</>}</>;
}
