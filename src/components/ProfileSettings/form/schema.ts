import { z } from 'zod';

import { lettersAndSpacesRegex } from '@/constants/regex';
import { defaultConstants, emailConstants, nameConstants, passwordConstants } from '@/constants/schemaConstants';

export const profileSettingsSchema = z.object({
  email: z
    .string()
    .email()
    .min(emailConstants.minLength, { message: 'Email is required' })
    .max(emailConstants.maxLength, { message: 'Email is too long' })
    .trim()
    .optional(),
  oldPassword: z
    .string()
    .optional()
    .refine(val => !val || (val.length >= passwordConstants.minLength && val.length <= passwordConstants.maxLength), {
      message: `Password must be at least ${passwordConstants.minLength} characters long`,
    }),
  newPassword: z
    .string()
    .optional()
    .refine(val => !val || (val.length >= passwordConstants.minLength && val.length <= passwordConstants.maxLength), {
      message: `Password must be at least ${passwordConstants.minLength} characters long`,
    }),
  firstName: z
    .string()
    .min(nameConstants.minLength, { message: 'First name is required' })
    .max(nameConstants.maxLength, { message: 'First name is too long' })
    .regex(lettersAndSpacesRegex, {
      message: 'Name must be only letters',
    })
    .trim(),
  lastName: z
    .string()
    .min(nameConstants.minLength, { message: 'Last name is required' })
    .max(nameConstants.maxLength, { message: 'Last name is too long' })
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
    .min(defaultConstants.minLength, { message: 'Country is required' })
    .max(defaultConstants.maxLength, { message: 'Country name is too long' })
    .trim(),
  city: z
    .string()
    .min(defaultConstants.minLength, { message: 'City is required' })
    .max(defaultConstants.maxLength, { message: 'City name is too long' })
    .trim(), avatar: z
      .string()
      .optional(),
  workPreference: z
    .string()
    .min(defaultConstants.minLength, { message: 'Work preference is required' })
    .max(defaultConstants.maxLength, { message: 'Work preference is too long' })
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