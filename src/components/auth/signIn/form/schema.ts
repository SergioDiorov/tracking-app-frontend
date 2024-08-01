import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: 'Email is required' })
    .max(64, { message: 'Email is too long' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(64, { message: 'Password is too long' })
    .trim(),
});