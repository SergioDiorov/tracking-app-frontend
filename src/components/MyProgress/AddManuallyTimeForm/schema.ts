import { z } from 'zod';

import { workPreferenceEnum, workPreferenceList, WorkPreferenceType } from '@/components/auth/constants';
import { TaskMoodEnum, taskMoodList, TaskMoodType } from '@/interfaces/taskLogs';

export const getAddManuallyTimeSchema = (timerStartTime?: Date) => z.object({
  organization: z
    .string({ required_error: 'Organization is required' })
    .min(1, { message: 'Organization is required' }),

  task: z
    .string({ required_error: 'Task is required' })
    .min(1, { message: 'Task is required' }),

  date: z
    .date({
      required_error: 'Date is required',
      invalid_type_error: 'Invalid date',
    })
    .refine((date) => {
      const selectedDate = new Date(date).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, {
      message: 'Date must be today or in the past',
    }),

  type: z
    .enum(Object.values(workPreferenceEnum) as [WorkPreferenceType, ...WorkPreferenceType[]], {
      required_error: 'Type is required',
      invalid_type_error: 'Invalid type selected',
    })
    .refine((value) => workPreferenceList.includes(value), {
      message: 'Type must be chosen from the allowed list',
    }),

  start: z
    .string({ required_error: 'Start time is required' })
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
      message: 'Start time must be in HH:mm format',
    }),

  end: z
    .string({ required_error: 'End time is required' })
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
      message: 'End time must be in HH:mm format',
    }),

  break: z.coerce
    .number({
      required_error: 'Break time is required',
      invalid_type_error: 'Break time must be a number',
    })
    .min(0, { message: 'Break time cannot be negative' })
    .max(480, { message: 'Break time cannot exceed 480 minutes' }),

  note: z
    .string()
    .max(500, { message: 'Note cannot exceed 500 characters' })
    .optional(),

  mood: z
    .enum(Object.values(TaskMoodEnum) as [TaskMoodType, ...TaskMoodType[]], {
      invalid_type_error: 'Invalid type selected',
    })
    .refine((value) => taskMoodList.includes(value), {
      message: 'Mood must be chosen from the allowed list',
    })
    .optional(),
}).superRefine((data, ctx) => {
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = data.date.setHours(0, 0, 0, 0) === today.getTime();

  const [startHour, startMinute] = data.start.split(':').map(Number);
  const [endHour, endMinute] = data.end.split(':').map(Number);

  const startTime = new Date();
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);

  // check if start time is less than end time
  if (startTime > endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['start'],
      message: 'Start time cannot be later than end time',
    });
  }

  // check if selected start and end times are not in the future
  if (isToday) {
    if (startTime > now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['start'],
        message: 'Start time cannot be in the future',
      });
    }

    if (endTime > now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end'],
        message: 'End time cannot be in the future',
      });
    }
  }

  // check if start and end times do not overlap with active timer
  if (timerStartTime && isToday) {
    const timerStartOfDay = new Date(timerStartTime);
    timerStartOfDay.setSeconds(0, 0);

    if (startTime.getTime() >= timerStartOfDay.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['start'],
        message: 'Start time overlaps with the active timer',
      });
    }

    if (endTime.getTime() >= timerStartOfDay.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end'],
        message: 'End time overlaps with the active timer',
      });
    }
  }
});

export type AddManuallyTimeSchemaType = z.infer<
  ReturnType<typeof getAddManuallyTimeSchema>
>;