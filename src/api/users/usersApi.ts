import axios from "axios";
import store from '@/redux/store';

import { IAuthResponse, IUploadAvatarResponse } from "@/api/users/usersTypes";

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
  },

  uploadAvatar({ file, userId }: { file: File, userId: string }) {
    const formData = new FormData();
    formData.append('file', file);

    return instance.post<IUploadAvatarResponse>(`${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}