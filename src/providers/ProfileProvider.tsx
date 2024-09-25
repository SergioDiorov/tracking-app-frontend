'use client';

// react
import { useEffect } from 'react';

// next
import { usePathname, useRouter } from 'next/navigation';

// redux
import { useAppDispatch, useAppSelector, useAuth } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import { setUserData } from '@/redux/user/userSlice';
import { logout } from '@/redux/auth/authSlice';
import { userLogout } from '@/redux/user/userSlice';
import {
  clearOrganizationData,
  setOrganizationData,
} from '@/redux/organization/organizationSlice';

// api
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users/usersApi';

// components
import { Loader } from '@/components/ui/loader';
import { organizationsApi } from '@/api/organizations/organizationsApi';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = useAuth();
  const dispatch = useAppDispatch();
  const path = usePathname();

  const userId = useAppSelector(userSelectors.getUserId);
  const isPathAuth = path.includes('signUp') || path.includes('signIn');

  const userData = useQuery({
    queryKey: ['getUserById'],
    queryFn: () => usersApi.getUserById(userId),
    select: (res) => res.data.data,
    enabled: !!userId,
  });

  const organizationData = useQuery({
    queryKey: ['getUserOrganization'],
    queryFn: () => organizationsApi.getUserOrganization(userId),
    select: (res) => res.data.data,
    enabled: !!userId,
  });

  useEffect(() => {
    const { data, isSuccess, isError, error } = userData;

    if (data && isSuccess) {
      dispatch(setUserData(data.profile));
      isPathAuth && router.push('/');
    }

    if (isError && error) {
      dispatch(logout());
      dispatch(userLogout());
      dispatch(clearOrganizationData());
      !isAuth && router.push('/signIn');
    }
  }, [
    userData.data,
    userData.isSuccess,
    userData.isError,
    userData.error,
    isAuth,
  ]);

  useEffect(() => {
    const { data, isSuccess } = organizationData;

    if (data && isSuccess) {
      dispatch(setOrganizationData(data.organization));
    }
  }, [organizationData.data, organizationData.isSuccess, isAuth]);

  if (userData.isLoading) {
    return <Loader full />;
  }

  return <> {isAuth && <>{children}</>}</>;
}
