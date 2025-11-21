import { httpClient } from "./httpClient";

export type UserDto = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  roleId: number;
  orgUnitId?: number;
  isActive: boolean;
};

export type UserListResponse = {
  items: UserDto[];
  total: number;
};

export type CreateUserDto = {
  username: string;
  email: string;
  fullName: string;
  password: string;
 /* roleId: number | undefined | null;*/
  orgUnitId?: number;
  isActive?: boolean;
};

export type UpdateUserDto = Partial<{
  username: string;
  email: string;
  fullName: string;
  password: string;
  roleId: number | undefined | null;
  orgUnitId: number;
  isActive?: boolean;
}>;

export const userService = {
  async list(): Promise<UserListResponse> {
    const { data } = await httpClient.get<UserListResponse>("/api/users");
    return data;
  },

  async findOne(id: number): Promise<UserDto> {
    const { data } = await httpClient.get<UserDto>(`/api/users/${id}`);
    return data;
  },

  async create(payload: CreateUserDto): Promise<UserDto> {
    const { data } = await httpClient.post<UserDto>("/api/users", payload);
    return data;
  },

  async update(id: number, payload: UpdateUserDto): Promise<UserDto> {
    const { data } = await httpClient.put<UserDto>(`/api/users/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/users/${id}`);
  },
};
