import {
  OrganizationTaskPriorityEnum,
  OrganizationTaskPriorityType,
  TaskWorkStatusEnum,
} from '@/interfaces/organization';
import { Badge } from '@/components/ui/badge';

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

export enum AnalyticsChildTabsEnum {
  MEMBERS = 'Members',
  TASKS = 'Tasks',
}

export type AnalyticsChildTabsType =
  | AnalyticsChildTabsEnum.MEMBERS
  | AnalyticsChildTabsEnum.TASKS;

export const analyticsChildTabsItems: AnalyticsChildTabsType[] = [
  AnalyticsChildTabsEnum.MEMBERS,
  AnalyticsChildTabsEnum.TASKS,
];

export const generatePriorityBgColor = ({
  value,
  vividColors = false,
}: {
  value: OrganizationTaskPriorityType;
  vividColors?: boolean;
}) => {
  switch (value) {
    case OrganizationTaskPriorityEnum.HIGH:
      return vividColors
        ? 'bg-[#FF4D4F] hover:bg-[#FF4D4F]'
        : 'bg-[#FFE5E5] hover:bg-[#FFE5E5]';
    case OrganizationTaskPriorityEnum.MEDIUM:
      return vividColors
        ? 'bg-[#FFC107] hover:bg-[#FFC107]'
        : 'bg-[#FFF8E1] hover:bg-[#FFF8E1]';
    case OrganizationTaskPriorityEnum.LOW:
      return vividColors
        ? 'bg-[#4CAF50] hover:bg-[#4CAF50]'
        : 'bg-[#E8F5E9] hover:bg-[#E8F5E9]';
    default:
      return '';
  }
};

export const PriorityBadge = ({
  value,
  vividColors = false,
}: {
  value: OrganizationTaskPriorityType;
  vividColors?: boolean;
}) => {
  return (
    <Badge
      variant='secondary'
      className={`text-primary-text/80 block w-full text-center max-w-20 ${generatePriorityBgColor(
        { value, vividColors },
      )} ${vividColors && '!text-white'}`}
    >
      {value}
    </Badge>
  );
};

export const handleFormatWorkStatus = (workStatus: TaskWorkStatusEnum) => {
  switch (workStatus) {
    case TaskWorkStatusEnum.TODO:
      return 'To Do';
    case TaskWorkStatusEnum.BLOCKED:
      return 'Blocked';
    case TaskWorkStatusEnum.INPROGRESS:
      return 'In progress';
    case TaskWorkStatusEnum.PUSHED:
      return 'Pushed';
    case TaskWorkStatusEnum.DONE:
      return 'Done';

    default:
      return '';
  }
};

export const formatloggedTimeDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
};
