import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { IAuthResponse } from '@/api/auth/authTypes';
import { AuthState } from '@/redux/auth/authTypes';

const initialState = {
  accessToken: '',
  refreshToken: '',
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<IAuthResponse>) => {
      state.accessToken = action.payload.data.access_token;
      state.refreshToken = action.payload.data.refresh_token;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setLoginData, logout, } = authSlice.actions;
export default authSlice.reducer;
