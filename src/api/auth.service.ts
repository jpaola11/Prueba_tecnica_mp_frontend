import { httpClient } from "./httpClient";

export type AuthLoginDto = {
  usernameOrEmail: string;
  password: string;
};

export type AuthRoleDto = {
  id: number;
  code: string;
  name: string;
};

export type AuthUserDto = {
  id: number;
  email: string;
  username: string;
  name: string | null;
  roles: AuthRoleDto[];
};

export type AuthResponseDto = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUserDto;
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

  async me(): Promise<AuthUserDto> {
    const { data } = await httpClient.get<AuthUserDto>("/api/auth/me");
    return data;
  },

  async logout(): Promise<void> {
    await httpClient.post("/api/auth/logout");
  },
};
