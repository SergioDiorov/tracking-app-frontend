import { z } from 'zod';

import { passwordConstants } from '@/constants/schemaConstants';

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .refine(val => !val || (val.length >= passwordConstants.minLength && val.length <= passwordConstants.maxLength), {
      message: `Password must be at least ${passwordConstants.minLength} characters long`,
    }),
  newPassword: z
    .string()
    .refine(val => !val || (val.length >= passwordConstants.minLength && val.length <= passwordConstants.maxLength), {
      message: `Password must be at least ${passwordConstants.minLength} characters long`,
    }),
})

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>