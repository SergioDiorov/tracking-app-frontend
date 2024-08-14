import axios from "axios";

import { IAuthResponse } from "@/api/users/usersTypes";

const instance = axios.create({
  baseURL: "http://localhost:3001/users/",
  headers: {
    'Content-Type': 'application/json',
  }
});

export const usersApi = {
  getUserById(userId: string) {
    return instance.get<IAuthResponse>(`${userId}`);
  }
}