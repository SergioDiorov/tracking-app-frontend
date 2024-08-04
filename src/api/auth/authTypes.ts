import { z } from "zod";

import { IResponse } from "@/interfaces/http";

import { signInSchema } from "@/components/auth/signIn/form/schema";
import { signUpSchema } from "@/components/auth/signUp/form/schema";

export type SignUpData = z.infer<typeof signUpSchema>;

export type SignInData = z.infer<typeof signInSchema>;

export interface IAuthResponse extends IResponse<{
  user: {
    email: string,
    id: string,
  },
  access_token: string,
  refresh_token: string,
}> { }
