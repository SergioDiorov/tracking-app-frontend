import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import authSelectors from '@/redux/auth/authSelectors';
import { useRouter } from 'next/navigation';
import { logout } from './auth/authSlice';
import { userLogout } from './user/userSlice';
import { clearOrganizationData } from './organization/organizationSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = (): boolean => {
  const refreshToken = useAppSelector(authSelectors.getRefreshToken);
  const accessToken = useAppSelector(authSelectors.getAccessToken);
  const isAuthenticated = !!(refreshToken && accessToken);

  return isAuthenticated;
};

export const useLogOut = (): () => void => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(userLogout());
    dispatch(clearOrganizationData());
    router.push('/signIn');
  }

  return handleLogOut;
};
