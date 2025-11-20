import { httpClient } from './httpClient';

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
};

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>('/api/auth/login', payload);
    return data;
  },
};
