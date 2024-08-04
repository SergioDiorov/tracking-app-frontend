import { IAuthResponse, SignInData, SignUpData } from "./authTypes";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/",
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