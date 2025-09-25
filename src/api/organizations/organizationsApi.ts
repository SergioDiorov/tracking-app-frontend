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
  ICreateOrganizationTaskData,
  IGetOrganizationTasksProgressData,
  IGetOrganizationTasksProgressResponse,
  IGetOrganizationMemberData,
  IGetOrganizationMemberResponse,
  IGetOrganizationEmployersAnalyticsResponse,
  IGetOrganizationTasksAnalyticsResponse,
  IGetOrganizationMembersForExportResponse
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
    const { organizationId, limit, page, search, userId, sortBy, sortOrder } = data;

    const params = new URLSearchParams();

    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (userId) params.set('userId', userId);
    if (search) params.set('search', search);

    return instance.get<IGetOrganizationMembersResponse>(`members/${organizationId}?${params.toString()}`);
  },

  getAllOrganizationMembersForExport(organizationId: string) {
    return instance.get<IGetOrganizationMembersForExportResponse>(`members/${organizationId}/export`);
  },

  getOrganizationMemberData(data: IGetOrganizationMemberData) {
    const { organizationId, userId } = data;
    return instance.get<IGetOrganizationMemberResponse>(`members/${organizationId}/${userId}`);
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
    const { organizationId, limit, page, sortBy, sortOrder, userId, filterByWorkStatus } = data;

    const params = new URLSearchParams();

    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    if (userId) params.set('userId', userId);
    if (filterByWorkStatus) params.set('filterByWorkStatus', filterByWorkStatus);

    return instance.get<IGetOrganizationTasksResponse>(`${organizationId}/tasks?${params.toString()}`);
  },

  getOrganizationTasksProgress(data: IGetOrganizationTasksProgressData) {
    const { organizationId, startDate, endDate, userId } = data;

    const params = new URLSearchParams();

    if (startDate) params.set('startDate', String(startDate));
    if (endDate) params.set('endDate', String(endDate));
    if (userId) params.set('userId', userId);

    return instance.get<IGetOrganizationTasksProgressResponse>(`${organizationId}/tasks/progress-weekly?${params.toString()}`);
  },

  getOrganizationEmployersAnalytics(organizationId: string) {
    return instance.get<IGetOrganizationEmployersAnalyticsResponse>(`${organizationId}/analytics/employers`);
  },

  getOrganizationTasksAnalytics(organizationId: string) {
    return instance.get<IGetOrganizationTasksAnalyticsResponse>(`${organizationId}/analytics/tasks`);
  },
}