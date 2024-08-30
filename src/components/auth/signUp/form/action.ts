"use server";

import { actionClient } from "@/lib/safe-action";
import { signUpSchema } from "@/components/auth/signUp/form/schema";
import { authApi } from "@/api/auth/authApi";

export const signUpUser = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await authApi.signUp(parsedInput);
      return res.data.data;
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: 'An error occurred during sign up.' };
    }
  });