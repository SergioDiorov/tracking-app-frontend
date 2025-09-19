import { WorkPreferenceType } from "@/components/auth/constants";
import { IMessageResponse, IPaginationData, IResponsePagination } from "@/interfaces/http";
import { TaskLogType, TaskMoodType } from "@/interfaces/taskLogs";

// CreateTaskLog
export type CreateTaskParams = {
  organizationId: string;
  task: string;
  date: string;
  type: WorkPreferenceType;
  start: string;
  end: string;
  breakSec: number;
  note?: string | any;
  mood?: TaskMoodType | any;
}

export interface CreateTaskLogData {
  data: CreateTaskParams
}

export interface CreateTaskLogResponse extends IMessageResponse<TaskLogType> { }

// GetTasksLog
export interface IGetTasksLogData extends IPaginationData {
  userId: string;
}

export type ExtendedLogDataType = TaskLogType & {
  task: {
    id: string;
    title: string;
  };
  organization: {
    avatar: string | null;
    name: string;
    id: string;
  }
}

export interface IGetTasksLogResponse extends IResponsePagination<{
  logs: ExtendedLogDataType[]
}> { }

// UpdateTaskLog
export interface UpdateTaskLogData {
  data: Partial<Omit<CreateTaskParams, 'organizationId' | 'task'>>
  logId: string
};

export interface UpdateTaskLogResponse extends IMessageResponse<TaskLogType> { }
