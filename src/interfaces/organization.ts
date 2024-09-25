import { IProfileType } from '@/interfaces/response';

export interface IOrganizationType {
  id: string,
  name: string,
  industry: IndustryType,
  registrationCountry: string,
  website: string,
  corporateEmail: string,
  avatar: string | null,
  description: string | null,
  ownerId: string,
  createdAt: string,
  updatedAt: string
};

export interface IOrganizationMemberType {
  id: string,
  user: string,
  organizationId: string,
  joined: string,
  email: string,
  position: OrganizationUserPositionType,
  workSchedule: string,
  workHours: number,
  salary: number,
  type: OrganizationUserTypeType,
  workExperienceMonth: number,
  role: OrganizationUserRoleType,
  userProfile?: Pick<IProfileType, 'age' | 'avatar' | 'country' | 'firstName' | 'lastName'>;
};

// Organization industry 
export enum IndustryEnum {
  IT = 'IT',
  ENGINEERING = 'Engineering',
  ENTERTAINMENT = 'Entertainment',
  MANAGEMENT = 'Management',
  OTHER = 'Other'
}

export type IndustryType =
  IndustryEnum.ENGINEERING |
  IndustryEnum.ENTERTAINMENT |
  IndustryEnum.IT |
  IndustryEnum.MANAGEMENT |
  IndustryEnum.OTHER;

export const industry: IndustryType[] = [IndustryEnum.ENGINEERING, IndustryEnum.ENTERTAINMENT, IndustryEnum.IT, IndustryEnum.MANAGEMENT, IndustryEnum.OTHER]

// Organization user role
export enum OrganizationUserRoleEnum {
  ADMIN = 'Admin',
  WORKER = 'Worker',
}

export type OrganizationUserRoleType = OrganizationUserRoleEnum.ADMIN | OrganizationUserRoleEnum.WORKER;

export const organizationUserRole: OrganizationUserRoleType[] = [OrganizationUserRoleEnum.ADMIN, OrganizationUserRoleEnum.WORKER];

// Organization user position
export enum OrganizationUserPositionEnum {
  MARKETINGMANAGER = 'MarketingManager',
  SALESMANAGER = 'SalesManager',
  PRODUCTMANAGER = 'ProductManager',
  HRMANAGER = 'HRManager',
  PROJECTMANAGER = 'ProjectManager',
  BUSINESSANALYST = 'BusinessAnalyst',
  ITMANAGER = 'ITManager',
}

export type OrganizationUserPositionType =
  OrganizationUserPositionEnum.MARKETINGMANAGER |
  OrganizationUserPositionEnum.SALESMANAGER |
  OrganizationUserPositionEnum.PRODUCTMANAGER |
  OrganizationUserPositionEnum.HRMANAGER |
  OrganizationUserPositionEnum.PROJECTMANAGER |
  OrganizationUserPositionEnum.BUSINESSANALYST |
  OrganizationUserPositionEnum.ITMANAGER;

export const organizationUserPosition: OrganizationUserPositionType[] = [
  OrganizationUserPositionEnum.MARKETINGMANAGER,
  OrganizationUserPositionEnum.SALESMANAGER,
  OrganizationUserPositionEnum.PRODUCTMANAGER,
  OrganizationUserPositionEnum.HRMANAGER,
  OrganizationUserPositionEnum.PROJECTMANAGER,
  OrganizationUserPositionEnum.BUSINESSANALYST,
  OrganizationUserPositionEnum.ITMANAGER,
]

// Organization user type
export enum OrganizationUserTypeEnum {
  CONTRACTOR = 'Contractor',
  PERMANENT = 'Permanent',
}

export type OrganizationUserTypeType = OrganizationUserTypeEnum.CONTRACTOR | OrganizationUserTypeEnum.PERMANENT;

export const organizationUserType: OrganizationUserTypeType[] = [OrganizationUserTypeEnum.CONTRACTOR, OrganizationUserTypeEnum.PERMANENT]