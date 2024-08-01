import { signInSchema } from "@/components/auth/signIn/form/schema";
import { signUpSchema } from "@/components/auth/signUp/form/schema";
import { z } from "zod";

export interface SignUpData {
  data: z.infer<typeof signUpSchema>
}

export interface SignInData {
  data: z.infer<typeof signInSchema>
}