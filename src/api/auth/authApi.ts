import axios from "axios";
import store from "@/redux/store";

import environment from "@/config";
import { IAuthResponse, ResetPasswordData, SignInData, SignUpData } from "./authTypes";
import { ISimpleMessageResponse } from "@/interfaces/http";

const instance = axios.create({
  baseURL: `${environment.BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  }
});


const excludedTokenAuthPaths = [
  '/signUp',
  '/signIn',
];

instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    const isExcluded = excludedTokenAuthPaths.some(path => config.url?.includes(path));

    if (token && !isExcluded) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  signUp(data: SignUpData) {
    return instance.post<IAuthResponse>(`signUp`, data);
  },

  signIn(data: SignInData) {
    return instance.post<IAuthResponse>(`signIn`, data);
  },

  refresh(refresh_token: string) {
    return instance.post<IAuthResponse>(`refresh`, { refresh_token });
  },

  resetPassword(data: ResetPasswordData) {
    return instance.post<ISimpleMessageResponse>(`reset-password`, data);
  }
}