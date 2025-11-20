import { httpClient } from "./httpClient";

export type OrgUnitDto = {
  id: number;
  parentId?: number | null;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export type OrgUnitListResponse = {
  items: OrgUnitDto[];
  total: number;
};

export type CreateOrgUnitDto = {
  parentId?: number | null;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateOrgUnitDto = Partial<{
  parentId: number | null;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}>;

export const orgUnitService = {
  async list(): Promise<OrgUnitListResponse> {
    const { data } = await httpClient.get<OrgUnitListResponse>("/api/org-unit");
    return data;
  },

  async findOne(id: number): Promise<OrgUnitDto> {
    const { data } = await httpClient.get<OrgUnitDto>(`/api/org-unit/${id}`);
    return data;
  },

  async create(payload: CreateOrgUnitDto): Promise<OrgUnitDto> {
    const { data } = await httpClient.post<OrgUnitDto>(
      "/api/org-unit",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateOrgUnitDto): Promise<OrgUnitDto> {
    const { data } = await httpClient.put<OrgUnitDto>(
      `/api/org-unit/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/org-unit/${id}`);
  },
};
