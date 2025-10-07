'use client';

// react
import { useEffect, useRef } from 'react';

// redux
import {
  useAppDispatch,
  useAppSelector,
  useAuth,
  useLogOut,
} from '@/redux/hooks';
import authSelectors from '@/redux/auth/authSelectors';
import { setLoginData } from '@/redux/auth/authSlice';
import { setUserLoginData } from '@/redux/user/userSlice';

// api
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth/authApi';

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  // hooks
  const isAuth = useAuth();
  const refreshIntervalRef = useRef<NodeJS.Timer>();
  const refreshToken = useAppSelector(authSelectors.getRefreshToken);
  const dispatch = useAppDispatch();
  const logOut = useLogOut();

  // refresh request
  const {
    data: refetchData,
    isSuccess: isSuccessRefetch,
    error: errorRefetch,
    isError: isErrorRefetch,
    refetch: refreshUserData,
  } = useQuery({
    queryKey: [`refreshUserData`],
    queryFn: () => authApi.refresh(refreshToken),
    select: (res) => res.data,
    enabled: false,
    retry: 2,
  });

  // update on refresh response
  useEffect(() => {
    if (refetchData && isSuccessRefetch) {
      dispatch(setLoginData(refetchData));
      dispatch(setUserLoginData(refetchData));
    }

    if (errorRefetch && isErrorRefetch) logOut();
  }, [refetchData, isSuccessRefetch, errorRefetch, isErrorRefetch]);

  useEffect(() => {
    if (isAuth) {
      refreshUserData();
    }
  }, [isAuth]);

  // interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuth) {
        refreshUserData();
      }
    }, 50 * 60 * 1000);

    refreshIntervalRef.current = interval;

    return () => {
      clearInterval(refreshIntervalRef.current as NodeJS.Timeout);
    };
  }, [isAuth, refreshToken, refreshUserData]);

  return <>{children}</>;
}
