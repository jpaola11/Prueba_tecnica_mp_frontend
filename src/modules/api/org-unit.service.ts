import { httpClient } from './httpClient';

export type OrgUnitDto = {
  id: number;
  code: string;
  name: string;
  parentId?: number | null;
  parentName?: string | null;
  isActive: boolean;
};

export type CreateOrgUnitDto = {
  code: string;
  name: string;
  parentId?: number | null;
  isActive: boolean;
};

export type UpdateOrgUnitDto = Partial<CreateOrgUnitDto>;

export const orgUnitService = {
  async list(): Promise<OrgUnitDto[]> {
    const { data } = await httpClient.get<OrgUnitDto[]>('/org-units');
    return data;
  },

  async findOne(id: number): Promise<OrgUnitDto> {
    const { data } = await httpClient.get<OrgUnitDto>(`/org-units/${id}`);
    return data;
  },

  async create(payload: CreateOrgUnitDto): Promise<OrgUnitDto> {
    const { data } = await httpClient.post<OrgUnitDto>('/org-units', payload);
    return data;
  },

  async update(id: number, payload: UpdateOrgUnitDto): Promise<OrgUnitDto> {
    const { data } = await httpClient.put<OrgUnitDto>(`/org-units/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/org-units/${id}`);
  },
};
