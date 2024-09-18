import { ProfileType } from '@/interfaces/response';

export interface OrganizationType {
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

export interface OrganizationMemberType {
  id: string,
  user: string,
  joined: string,
  role: OrganizationRoleType,
  organizationId: string,
  userProfile: Pick<ProfileType, 'age' | 'avatar' | 'country' | 'firstName' | 'lastName'>;
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

// Organization member roles 
export enum OrganizationRoleEnum {
  MARKETING_MANAGER = 'MarketingManager',
  SALES_MANAGER = 'SalesManager',
  PRODUCT_MANAGER = 'ProductManager',
  HR_MANAGER = 'HRManager',
  PROJECT_MANAGER = 'ProjectManager',
  BUSINESS_ANALYST = 'BusinessAnalyst',
  IT_MANAGER = 'ITManager',
}

export type OrganizationRoleType =
  OrganizationRoleEnum.MARKETING_MANAGER |
  OrganizationRoleEnum.SALES_MANAGER |
  OrganizationRoleEnum.PRODUCT_MANAGER |
  OrganizationRoleEnum.HR_MANAGER |
  OrganizationRoleEnum.PROJECT_MANAGER |
  OrganizationRoleEnum.BUSINESS_ANALYST |
  OrganizationRoleEnum.IT_MANAGER;

export const organizationRole: OrganizationRoleType[] = [
  OrganizationRoleEnum.MARKETING_MANAGER,
  OrganizationRoleEnum.SALES_MANAGER,
  OrganizationRoleEnum.PRODUCT_MANAGER,
  OrganizationRoleEnum.HR_MANAGER,
  OrganizationRoleEnum.PROJECT_MANAGER,
  OrganizationRoleEnum.BUSINESS_ANALYST,
  OrganizationRoleEnum.IT_MANAGER,
]