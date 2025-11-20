import { httpClient } from './httpClient';

export type UserDto = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  orgUnitId?: number | null;
  orgUnitName?: string | null;
  roleId?: number | null;
  roleName?: string | null;
  isActive: boolean;
};

export type UserQueryDto = {
  search?: string;
  orgUnitId?: number;
  roleId?: number;
  isActive?: boolean;
};

export type CreateUserDto = {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  orgUnitId?: number | null;
  roleId?: number | null;
  isActive: boolean;
};

export type UpdateUserDto = Partial<CreateUserDto>;

export const userService = {
  async list(query: UserQueryDto = {}): Promise<UserDto[]> {
    const { data } = await httpClient.get<UserDto[]>('/users', { params: query });
    return data;
  },

  async findOne(id: number): Promise<UserDto> {
    const { data } = await httpClient.get<UserDto>(`/users/${id}`);
    return data;
  },

  async create(payload: CreateUserDto): Promise<UserDto> {
    const { data } = await httpClient.post<UserDto>('/users', payload);
    return data;
  },

  async update(id: number, payload: UpdateUserDto): Promise<UserDto> {
    const { data } = await httpClient.put<UserDto>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  },
};
