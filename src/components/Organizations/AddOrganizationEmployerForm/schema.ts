import { z } from 'zod';

import {
  OrganizationUserPositionType,
  organizationUserPosition,
  OrganizationUserTypeType,
  organizationUserType,
  OrganizationUserRoleType,
  organizationUserRole,
  OrganizationUserPositionEnum,
  OrganizationUserTypeEnum,
  OrganizationUserRoleEnum,
} from '@/interfaces/organization';
import { organizationMemberConstants } from '@/constants/schemaConstants';

export const addOrganizationMemberSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email must be a valid email address' })
    .trim(),
  position: z
    .enum(Object.values(OrganizationUserPositionEnum) as [OrganizationUserPositionType, ...OrganizationUserPositionType[]], { message: 'Position must be chosen' })
    .refine((value) => organizationUserPosition.includes(value), {
      message: `Position must be chosen from list`,
    }),
  workSchedule: z
    .string()
    .min(1, { message: 'Work schedule is required' })
    .max(10, { message: 'Work schedule is too long' })
    .trim(),
  type: z
    .enum(Object.values(OrganizationUserTypeEnum) as [OrganizationUserTypeType, ...OrganizationUserTypeType[]], { message: 'Type must be chosen' })
    .refine((value) => organizationUserType.includes(value), {
      message: `Type must be one  chosen from list`,
    }),
  role: z
    .enum(Object.values(OrganizationUserRoleEnum) as [OrganizationUserRoleType, ...OrganizationUserRoleType[]], { message: 'Role must be chosen' })
    .refine((value) => organizationUserRole.includes(value), {
      message: `Role must be one  chosen from list`,
    }),
  workHours: z
    .number()
    .int({ message: 'Work hours must be an integer' })
    .positive({ message: 'Work hours must be a positive number' })
    .min(organizationMemberConstants.workHours.min, { message: `Work hours must be at least ${organizationMemberConstants.workHours.min}` })
    .max(organizationMemberConstants.workHours.max, { message: `Work hours must not exceed ${organizationMemberConstants.workHours.max}` }),
  salary: z
    .number()
    .int({ message: 'Salary must be an integer' })
    .positive({ message: 'Salary must be a positive number' })
    .min(organizationMemberConstants.salary.min, { message: `Salary must be at least ${organizationMemberConstants.salary.min}` }),
  experienceMonth: z
    .number()
    .int({ message: 'Work experience in months must be an integer' })
    .positive({ message: 'Work experience must be a positive number' })
    .min(organizationMemberConstants.experienceMonth.min, { message: `Work experience in months must be at least ${organizationMemberConstants.experienceMonth.min}` })
    .max(organizationMemberConstants.experienceMonth.max, { message: `Work experience in months must not exceed ${organizationMemberConstants.experienceMonth.max}` }),
  experienceYears: z
    .number()
    .int({ message: 'Work experience in years must be an integer' })
    .positive({ message: 'Work experience must be a positive number' })
    .min(organizationMemberConstants.experienceYears.min, { message: `Work experience in years must be at least ${organizationMemberConstants.experienceYears.min}` })
    .max(organizationMemberConstants.experienceYears.max, { message: `Work experience in years must not exceed ${organizationMemberConstants.experienceYears.max}` }),
});

export type AddOrganizationMemberSchemaType = z.infer<typeof addOrganizationMemberSchema>;
