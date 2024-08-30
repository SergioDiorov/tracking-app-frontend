"use server";

import { actionClient } from "@/lib/safe-action";
import { authApi } from "@/api/auth/authApi";
import { signInSchema } from "./schema";

export const signInUser = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    try {
      const res = await authApi.signIn(parsedInput);
      return res.data.data;
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error: 'An error occurred during sign in.' };
    }
  });