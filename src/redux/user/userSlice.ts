import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { IAuthResponse } from '@/api/auth/authTypes';
import { UserType } from '@/redux/user/userTypes';
import { IProfileType } from '@/interfaces/response';

const initialState = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  age: '',
  country: '',
  city: '',
  workPreference: '',
  avatar: null,
} as UserType;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IProfileType>) => {
      const { userId, id, ...restProfileData } = action.payload;
      return { ...state, id: userId, ...restProfileData }
    },
    setUserPartialData: (state, action: PayloadAction<Partial<IProfileType>>) => {
      return { ...state, ...action.payload }
    },
    setUserLoginData: (state, action: PayloadAction<IAuthResponse>) => {
      state.id = action.payload.data.user.id;
      state.email = action.payload.data.user.email;
    },
    userLogout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setUserData,
  setUserLoginData,
  userLogout,
  setUserPartialData
} = userSlice.actions;

export default userSlice.reducer;
