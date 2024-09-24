import axios from "axios";
import store from '@/redux/store';

import environment from "@/config";
import { ICreateOrganizationData, ICreateOrganizationResponse, IGetUserOrganizationResponse, IGetOrganizationMembersResponse, IGetOrganizationMembersData, IAddUserToOrganizationData, IAddUserToOrganizationResponse } from "./organizationsTypes";
import { objectToFormData } from "@/helpers/objectToFormData";

const instance = axios.create({
  baseURL: `${environment.BASE_URL}/organizations/`,
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

export const organizationsApi = {
  getUserOrganization(userId: string) {
    return instance.get<IGetUserOrganizationResponse>(`${userId}`);
  },

  getOrganizationMembers(data: IGetOrganizationMembersData) {
    const { organizationId, limit, page } = data;
    return instance.get<IGetOrganizationMembersResponse>(`members/${organizationId}?limit=${limit}&page=${page}`);
  },

  createOrganization({ file, data }: ICreateOrganizationData) {
    const formData = objectToFormData(data);
    file && formData.append('file', file);

    return instance.post<ICreateOrganizationResponse>('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  addUserToOrganization({ organizationId, userData }: IAddUserToOrganizationData) {
    return instance.post<IAddUserToOrganizationResponse>(`${organizationId}/add`, userData);
  }
}