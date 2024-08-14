// types
import { RootState } from '@/redux/store';

const getUserId = (state: RootState) => state.user.id;
const getUserEmail = (state: RootState) => state.user.email;
const getUserData = (state: RootState) => state.user;

const userSelectors = {
  getUserId,
  getUserEmail,
  getUserData
};

export default userSelectors;
