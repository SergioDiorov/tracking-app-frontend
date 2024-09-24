import { IMessageResponse, IResponse, IPaginationData, IResponsePagination } from "@/interfaces/http";
import {
  IndustryType,
  IOrganizationMemberType,
  IOrganizationType,
  OrganizationUserPositionType,
  OrganizationUserRoleType,
  OrganizationUserTypeType
} from "@/interfaces/organization";

// GetUserOrganization
export interface IGetUserOrganizationResponse extends IResponse<{
  organization: IOrganizationType;
}> { }

// GetOrganizationMembers
export interface IGetOrganizationMembersResponse extends IResponsePagination<{
  members: IOrganizationMemberType[];
}> { }

export interface IGetOrganizationMembersData extends IPaginationData {
  organizationId: string;
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
