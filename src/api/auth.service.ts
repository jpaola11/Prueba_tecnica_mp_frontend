import { httpClient } from "./httpClient";

export type AuthLoginDto = {
  usernameOrEmail: string;
  password: string;
};

export type AuthResponseDto = {
  accessToken: string;
  refreshToken?: string; // si tu backend lo usa
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    roleId: number;
    orgUnitId?: number;
    isActive: boolean;
  };
};

export const authService = {
  async login(payload: AuthLoginDto): Promise<AuthResponseDto> {
    const { data } = await httpClient.post<AuthResponseDto>(
      "/api/auth/login",
      payload
    );
    return data;
  },

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    const { data } = await httpClient.post<AuthResponseDto>(
      "/api/auth/refresh",
      { refreshToken }
    );
    return data;
  },

  async me(): Promise<AuthResponseDto["user"]> {
    const { data } = await httpClient.get<AuthResponseDto["user"]>(
      "/api/auth/me"
    );
    return data;
  },

  async logout(): Promise<void> {
    await httpClient.post("/api/auth/logout");
  },
};
