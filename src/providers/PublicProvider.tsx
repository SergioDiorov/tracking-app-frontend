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
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { setOrganizationData } from '@/redux/organization/organizationSlice';

export function PublicProvider({ children }: { children: React.ReactNode }) {
  const isAuth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSelectors.getUserId);

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

  const isAuthWithProfile =
    isAuth && userId && userData.data && userData.isSuccess;

  useEffect(() => {
    if (userData.data) dispatch(setUserData(userData.data.profile));
  }, [userData.data]);

  useEffect(() => {
    if (isAuthWithProfile) {
      router.push('/');
    }
  }, [isAuthWithProfile, router]);

  useEffect(() => {
    const { data, isSuccess } = organizationData;

    if (data && isSuccess) {
      dispatch(setOrganizationData(data.organization));
    }
  }, [organizationData.data, organizationData.isSuccess, isAuth]);

  if (userData.isLoading) {
    return <Loader full />;
  }

  if (!isAuth || !isAuthWithProfile) {
    return <>{children}</>;
  }

  return null;
}
