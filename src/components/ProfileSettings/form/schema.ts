import { z } from 'zod';

import { lettersAndSpacesRegex } from '@/constants/regex';

export const profileSettingsSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: 'Email is required' })
    .max(64, { message: 'Email is too long' })
    .trim()
    .optional(),
  oldPassword: z
    .string()
    .optional()
    .refine(val => !val || (val.length >= 8 && val.length <= 64), {
      message: 'Password must be at least 8 characters long',
    }),
  newPassword: z
    .string()
    .optional()
    .refine(val => !val || (val.length >= 8 && val.length <= 64), {
      message: 'Password must be at least 8 characters long',
    }),
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(64, { message: 'First name is too long' })
    .regex(lettersAndSpacesRegex, {
      message: 'Name must be only letters',
    })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(64, { message: 'Last name is too long' })
    .regex(lettersAndSpacesRegex, {
      message: 'Name must be only letters',
    })
    .trim(),
  age: z
    .string()
    .min(2, { message: 'Age is required' })
    .max(2, { message: 'Age is not valid' })
    .regex(/^[1-9][0-9]$/, { message: 'Age must be a number between 18 and 70' })
    .trim(),
  country: z
    .string()
    .min(1, { message: 'Country is required' })
    .max(64, { message: 'Country name is too long' })
    .trim(),
  city: z
    .string()
    .min(1, { message: 'City is required' })
    .max(64, { message: 'City name is too long' })
    .trim(), avatar: z
      .string()
      .optional(),
  workPreference: z
    .string()
    .min(1, { message: 'Work preference is required' })
    .max(64, { message: 'Work preference is too long' })
    .trim(),
})
// .refine(data => {
//   if (!data.oldPassword?.length && !data.newPassword?.length) {
//     return true
//   }
//   if (data.oldPassword || data.newPassword) {
//     if (!data.oldPassword || !data.newPassword) {
//       return false;
//     }
//     if (data.oldPassword === data.newPassword) {
//       return false;
//     }
//   }
//   return true;
// }, {
//   message: 'Other password field must be filled with different password',
//   path: ['newPassword'],
// });

export type ProfileSchemaType = z.infer<typeof profileSettingsSchema>