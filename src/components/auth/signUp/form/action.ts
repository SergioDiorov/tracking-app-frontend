"use server";

import { actionClient } from "@/lib/safe-action";
import { signUpSchema } from "@/components/auth/signUp/form/schema";
import { authApi } from "@/api/auth/authApi";

export const signUpUser = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await authApi.signUp({ data: parsedInput });
      return await response.json();
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error: 'An error occurred during sign up.' };
    }
  });