import { httpClient } from './httpClient';

export type RoleDto = {
  id: number;
  code: string;
  name: string;
  description?: string;
  isDefault?: boolean;
};

export type CreateRoleDto = {
  code: string;
  name: string;
  description?: string;
};

export type UpdateRoleDto = Partial<CreateRoleDto>;

export const roleService = {
  async list(): Promise<RoleDto[]> {
    const { data } = await httpClient.get<RoleDto[]>('/roles');
    return data;
  },

  async findOne(id: number): Promise<RoleDto> {
    const { data } = await httpClient.get<RoleDto>(`/roles/${id}`);
    return data;
  },

  async create(payload: CreateRoleDto): Promise<RoleDto> {
    const { data } = await httpClient.post<RoleDto>('/roles', payload);
    return data;
  },

  async update(id: number, payload: UpdateRoleDto): Promise<RoleDto> {
    const { data } = await httpClient.put<RoleDto>(`/roles/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/roles/${id}`);
  },
};
