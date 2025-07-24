import axios from "axios";
import store from '@/redux/store';

import environment from "@/config";
import {
  ICreateOrganizationData,
  ICreateOrganizationResponse,
  IGetUserOrganizationResponse,
  IGetOrganizationMembersResponse,
  IGetOrganizationMembersData,
  IAddUserToOrganizationData,
  IAddUserToOrganizationResponse,
  IGetOrganizationTasksData,
  IGetOrganizationTasksResponse,
  ICreateOrganizationTaskData
} from "./organizationsTypes";
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
    const { organizationId, limit, page, search } = data;
    return instance.get<IGetOrganizationMembersResponse>(`members/${organizationId}?limit=${limit}&page=${page}`, { params: { search } });
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
  },

  createOrganizationTask({ organizationId, taskData }: ICreateOrganizationTaskData) {
    return instance.post<ICreateOrganizationResponse>(`${organizationId}/tasks/create`, taskData);
  },

  getOrganizationTasks(data: IGetOrganizationTasksData) {
    const { organizationId, limit, page, sortBy, sortOrder } = data;

    const params = new URLSearchParams();

    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    return instance.get<IGetOrganizationTasksResponse>(`${organizationId}/tasks?${params.toString()}`);
  },

}