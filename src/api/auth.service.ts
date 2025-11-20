import { httpClient } from './httpClient';

export type LoginRequest = {
  email: string;
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
    const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },
};
