"use server";

import { actionClient } from "@/lib/safe-action";
import { authApi } from "@/api/auth/authApi";
import { signInSchema } from "./schema";

export const signInUser = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await authApi.signIn({ data: parsedInput });
      return await response.json();
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error: 'An error occurred during sign in.' };
    }
  });