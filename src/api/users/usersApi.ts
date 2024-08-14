import axios from "axios";
import store from '@/redux/store';

import { IAuthResponse } from "@/api/users/usersTypes";

const instance = axios.create({
  baseURL: "http://localhost:3001/users/",
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const usersApi = {
  getUserById(userId: string) {
    return instance.get<IAuthResponse>(`${userId}`);
  }
}