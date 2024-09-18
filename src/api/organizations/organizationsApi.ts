import axios from "axios";
import store from '@/redux/store';

import { ICreateOrganizationData, ICreateOrganizationResponse, IGetUserOrganizationResponse, IGetOrganizationMembersResponse, IGetOrganizationMembersData } from "./organizationsTypes";

const instance = axios.create({
  baseURL: "http://localhost:3001/organizations/",
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
    const formData = new FormData();
    file && formData.append('file', file);
    data.description && formData.append('description', data.description);
    formData.append('name', data.name);
    formData.append('industry', data.industry);
    formData.append('registrationCountry', data.registrationCountry);
    formData.append('website', data.website);
    formData.append('corporateEmail', data.corporateEmail);

    return instance.post<ICreateOrganizationResponse>('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
}