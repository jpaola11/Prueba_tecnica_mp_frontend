import { httpClient } from "./httpClient";

export type UserRoleDto = {
  id: number;
  userId: number;
  roleId: number;
  assignedAt: string;
  assignedBy: number;
};

export type UserRoleListResponse = {
  items: UserRoleDto[];
  total: number;
};

export type AssignUserRoleDto = {
  userId: number;
  roleId: number;
};

export type UpdateUserRoleDto = Partial<{
  roleId: number;
}>;

export const userRoleService = {
  async list(userId?: number): Promise<UserRoleListResponse> {
    const { data } = await httpClient.get<UserRoleListResponse>(
      "/api/user-role",
      { params: { userId } }
    );
    return data;
  },

  async findOne(id: number): Promise<UserRoleDto> {
    const { data } = await httpClient.get<UserRoleDto>(
      `/api/user-role/${id}`
    );
    return data;
  },

  async assign(payload: AssignUserRoleDto): Promise<UserRoleDto> {
    const { data } = await httpClient.post<UserRoleDto>(
      "/api/user-role",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateUserRoleDto): Promise<UserRoleDto> {
    const { data } = await httpClient.put<UserRoleDto>(
      `/api/user-role/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/user-role/${id}`);
  },
};
