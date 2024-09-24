import axios from "axios";
import store from '@/redux/store';

import environment from "@/config";
import { IGetUserByIdResponse, IUploadAvatarResponse, IUpdateProfileResponse, IUpdateProfileData } from "@/api/users/usersTypes";

const instance = axios.create({
  baseURL: `${environment.BASE_URL}/users/`,
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
    return instance.get<IGetUserByIdResponse>(`${userId}`);
  },

  updateProfileById({ userId, updateProfileData }: IUpdateProfileData) {
    return instance.patch<IUpdateProfileResponse>(`${userId}`, updateProfileData);
  },

  uploadAvatar({ file, userId }: { file: File, userId: string }) {
    const formData = new FormData();
    formData.append('file', file);

    return instance.post<IUploadAvatarResponse>(`${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteAvatar({ userId }: { userId: string }) {
    return instance.delete<IUploadAvatarResponse>(`${userId}/avatar`);
  }
}