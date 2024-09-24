import { z } from 'zod';

import { lettersAndSpacesRegex } from '@/constants/regex';
import { defaultConstants, emailConstants, nameConstants, passwordConstants } from '@/constants/schemaConstants';

export const signUpSchema = z.object({
  email: z
    .string()
    .email()
    .min(emailConstants.minLength, { message: 'Email is required' })
    .max(emailConstants.maxLength, { message: 'Email is too long' })
    .trim(),
  password: z
    .string()
    .min(passwordConstants.minLength, { message: 'Password must be at least 8 characters long' })
    .max(passwordConstants.minLength, { message: 'Password is too long' })
    .trim(),
  confirmPassword: z
    .string()
    .min(passwordConstants.minLength, { message: 'Confirm password must be at least 8 characters long' })
    .max(passwordConstants.minLength, { message: 'Confirm password is too long' })
    .trim(),
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
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});