// types
import { RootState } from '@/redux/store';

const getAccessToken = (state: RootState) => state.auth.accessToken;
const getRefreshToken = (state: RootState) => state.auth.refreshToken;

const authSelectors = {
  getAccessToken,
  getRefreshToken,
};

export default authSelectors;
