import { z } from 'zod';

import {
  OrganizationTaskPriorityEnum
} from '@/interfaces/organization';

export const addNewTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required', invalid_type_error: 'Title must be a string' })
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title is too long' }),

  descriptopn: z
    .string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' })
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description is too long' }),

  assignee: z
    .string({ required_error: 'Assignee required', invalid_type_error: 'Assignee must be a string' })
    .min(1, { message: 'Assignee required' }),

  priority: z.enum(
    [OrganizationTaskPriorityEnum.LOW, OrganizationTaskPriorityEnum.MEDIUM, OrganizationTaskPriorityEnum.HIGH] as const,
    {
      required_error: 'Priority is required',
      invalid_type_error: 'Priority must be one of the following: LOW, MEDIUM, HIGH',
    }
  ),

  deadline: z
    .date({
      required_error: 'Deadline is required',
      invalid_type_error: 'Invalid date',
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Deadline must be today or in the future',
    }),
});

export type AddNewTaskSchemaType = z.infer<typeof addNewTaskSchema>;
