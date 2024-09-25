export enum OrganizationMenuEnum {
  EMPLOYEES = 'Employees',
  TASKS = 'Tasks',
  PROGRESS = 'Progress',
  ANALYTICS = 'Analytics',
}

export type OrganizationMenuType =
  | OrganizationMenuEnum.EMPLOYEES
  | OrganizationMenuEnum.TASKS
  | OrganizationMenuEnum.PROGRESS
  | OrganizationMenuEnum.ANALYTICS;

export const organizationMenuItems: OrganizationMenuType[] = [
  OrganizationMenuEnum.EMPLOYEES,
  OrganizationMenuEnum.TASKS,
  OrganizationMenuEnum.PROGRESS,
  OrganizationMenuEnum.ANALYTICS,
];
