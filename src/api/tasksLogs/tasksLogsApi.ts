import axios from "axios";
import store from '@/redux/store';

import environment from "@/config";
import { CreateTaskLogData, CreateTaskLogResponse, IGetTasksLogData, IGetTasksLogResponse, UpdateTaskLogData, UpdateTaskLogResponse } from "./tasksLogsTypes";

const instance = axios.create({
  baseURL: `${environment.BASE_URL}/task-logs/`,
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

export const tasksLogsApi = {
  createTaskLog({ data }: CreateTaskLogData) {
    return instance.post<CreateTaskLogResponse>('', data);
  },

  getTasksLog(data: IGetTasksLogData) {
    const { userId, limit, page } = data;

    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (page) params.set('page', String(page));

    return instance.get<IGetTasksLogResponse>(`${userId}/?${params.toString()}`);
  },

  updateTaskLog({ data, logId }: UpdateTaskLogData) {
    return instance.patch<UpdateTaskLogResponse>(`/${logId}`, data);
  },
}