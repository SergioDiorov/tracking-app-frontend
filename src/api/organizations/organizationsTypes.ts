import { IMessageResponse, IResponse, IPaginationData, IResponsePagination } from "@/interfaces/http";
import {
  IndustryType,
  IOrganizationMemberType,
  IOrganizationTaskType,
  IOrganizationType,
  OrganizationTaskPriorityEnum,
  OrganizationUserPositionType,
  OrganizationUserRoleType,
  OrganizationUserTypeType,
  TaskWorkStatusEnum
} from "@/interfaces/organization";
import { IProfileType } from "@/interfaces/response";

// GetUserOrganization
export interface IGetUserOrganizationResponse extends IResponse<{
  organization: IOrganizationType;
}> { }

// GetOrganizationMembers
export interface IGetOrganizationMembersResponse extends IResponsePagination<{
  members: IOrganizationMemberType[];
}> { }


export type OrganizationMembersSortByType = 'joined' | 'position' | 'workHours' | 'salary' | 'type' | 'workExperienceMonth' | 'role' | 'firstName' | 'age' | 'country';
export type OrganizationMembersOrderType = 'asc' | 'desc';


export interface IGetOrganizationMembersData extends IPaginationData {
  organizationId: string;
  search?: string;
  userId?: string;
  sortBy?: OrganizationMembersSortByType;
  sortOrder?: OrganizationMembersOrderType;
}

// GetOrganizationMembersForExport
export interface IGetOrganizationMembersForExportResponse extends IResponse<{
  members: Array<Pick<IOrganizationMemberType,
    'joined' |
    'email' |
    'position' |
    'workSchedule' |
    'workHours' |
    'salary' |
    'type' |
    'workExperienceMonth' |
    'role'
  > & Pick<IProfileType,
    'firstName' |
    'lastName' |
    'age' |
    'country'
  >>;
}> { }

// GetOrganizationMember
export interface IGetOrganizationMemberResponse extends IResponsePagination<{
  member: IOrganizationMemberType;
}> { }

export interface IGetOrganizationMemberData {
  organizationId: string;
  userId: string;
}

// CreateOrganization
export interface ICreateOrganizationResponse extends IMessageResponse<{
  organization: IOrganizationType;
}> { }

export interface ICreateOrganizationData {
  data: {
    name: string;
    industry: IndustryType;
    registrationCountry: string;
    website: string;
    corporateEmail: string;
    description?: string;
  };
  file: File | null;
}

// AddUserToOrganization
export interface IAddUserToOrganizationResponse extends IMessageResponse<{
  member: IOrganizationMemberType;
}> { }

export interface IAddUserToOrganizationData {
  organizationId: string;
  userData: {
    email: string;
    position: OrganizationUserPositionType;
    workSchedule: string;
    type: OrganizationUserTypeType;
    role: OrganizationUserRoleType;
    workHours: number;
    salary: number;
    workExperienceMonth: number;
  }
}

// GetOrganizationTasks
export interface IGetOrganizationTasksResponse extends IResponsePagination<{
  tasks: IOrganizationTaskType[];
}> { }

export type TaskSortByType = 'title' | 'assignee' | 'priority' | 'deadline' | 'createdAt';
export type TaskOrderType = 'asc' | 'desc';

export interface IGetOrganizationTasksData extends IPaginationData {
  organizationId: string;
  sortBy?: TaskSortByType,
  sortOrder?: TaskOrderType,
  userId?: string;
  filterByWorkStatus?: TaskWorkStatusEnum;
}

// GetOrganizationTasksProgress
export interface IGetOrganizationTasksProgressResponse {
  totalLoggedTimeSec: number;
  totalLoggedTimeSecMonth: number;
  totalLoggedTimePerDates: Record<string, number> | null;
}

export interface IGetOrganizationTasksProgressData {
  organizationId: string;
  startDate: string;
  endDate: string;
  userId?: string;
}


// CreateOrganizationTasks
export type CreateOrganizationTaskParamsType = {
  title: string;
  descriptopn: string;
  assignee: string;
  priority: string;
  deadline: string;
}

export interface ICreateOrganizationTaskData {
  organizationId: string;
  taskData: CreateOrganizationTaskParamsType
}

// UpdateOrganizationTasks
export interface IUpdateOrganizationTaskData {
  organizationId: string;
  taskId: string;
  taskData: Partial<CreateOrganizationTaskParamsType>;
}

export interface IUpdateOrganizationTaskResponse extends IMessageResponse<{
  task: IOrganizationTaskType;
}> { }

// GetOrganizationEmployersAnalytics
export interface IGetOrganizationEmployersAnalyticsResponse extends IResponse<{
  salary: Record<string, number>,
  age: Record<string, number>,
  experience: Record<string, number>,
}> { }

// GetOrganizationTasksAnalytics
export interface IGetOrganizationTasksAnalyticsResponse extends IResponse<{
  loggedTime: { month: string, hours: number }[],
  tasksByPriority: { [key in OrganizationTaskPriorityEnum]: number }
  tasksByWorkStatus: { [key in TaskWorkStatusEnum]: number }
}> { }