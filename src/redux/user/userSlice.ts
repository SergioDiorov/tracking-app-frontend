import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { IAuthResponse } from '@/api/auth/authTypes';
import { UserType } from '@/redux/user/userTypes';

const initialState = {
  id: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  age: '',
  country: '',
  city: '',
  workPreference: '',
} as UserType;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload.data.user }
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
} = userSlice.actions;

export default userSlice.reducer;
