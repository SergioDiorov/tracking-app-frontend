// types
import { RootState } from '@/redux/store';

const getUserId = (state: RootState) => state.user.id;
const getUserEmail = (state: RootState) => state.user.email;

const userSelectors = {
  getUserId,
  getUserEmail,
};

export default userSelectors;
