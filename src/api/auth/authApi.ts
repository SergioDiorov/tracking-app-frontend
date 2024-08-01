import { SignInData, SignUpData } from "./authTypes";

const baseUrl = 'http://localhost:3001'
const requestHeaders = {
  'Content-Type': 'application/json',
};

export const authApi = {
  async signUp(data: SignUpData) {
    const response = await fetch(`${baseUrl}/signUp`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(data),
    });

    return response
  },

  async signIn(data: SignInData) {
    const response = await fetch(`${baseUrl}/signIn`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(data),
    });

    return response
  }
}