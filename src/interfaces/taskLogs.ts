import { WorkPreferenceType } from "@/components/auth/constants";

export interface TaskLogType {
  id: string,
  organizationId: string,
  taskId: string | null,
  date: string,
  type: WorkPreferenceType,
  start: string,
  end: string,
  breakSec: number,
  note: string | null,
  mood: TaskMoodType | null,
  assigneeId: string,
  createdAt: string,
  updatedAt: string,
}

export enum TaskMoodEnum {
  ANGRY = 'ANGRY',
  FROWN = 'FROWN',
  MEH = 'MEH',
  SMILE = 'SMILE',
  LAUGH = 'LAUGH',
}

export type TaskMoodType = TaskMoodEnum.ANGRY | TaskMoodEnum.FROWN | TaskMoodEnum.MEH | TaskMoodEnum.SMILE | TaskMoodEnum.LAUGH;

export const taskMoodList: TaskMoodType[] = [TaskMoodEnum.ANGRY, TaskMoodEnum.FROWN, TaskMoodEnum.MEH, TaskMoodEnum.SMILE, TaskMoodEnum.LAUGH]