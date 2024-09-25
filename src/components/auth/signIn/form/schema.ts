import { z } from 'zod';

import { emailConstants, passwordConstants } from '@/constants/schemaConstants';

export const signInSchema = z.object({
  email: z
    .string()
    .email()
    .min(emailConstants.minLength, { message: 'Email is required' })
    .max(emailConstants.maxLength, { message: 'Email is too long' })
    .trim(),
  password: z
    .string()
    .min(passwordConstants.minLength, { message: 'Password must be at least 8 characters long' })
    .max(passwordConstants.maxLength, { message: 'Password is too long' })
    .trim(),
});