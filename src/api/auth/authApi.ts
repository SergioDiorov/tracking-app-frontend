import axios from "axios";

import environment from "@/config";
import { IAuthResponse, SignInData, SignUpData } from "./authTypes";

const instance = axios.create({
  baseURL: `${environment.BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const authApi = {
  signUp(data: SignUpData) {
    return instance.post<IAuthResponse>(`signUp`, data);
  },

  signIn(data: SignInData) {
    return instance.post<IAuthResponse>(`signIn`, data);
  }
}