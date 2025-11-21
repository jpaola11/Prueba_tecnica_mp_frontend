import { httpClient } from "./httpClient";

export type CaseFileDto = {
  id: number;
  code: string;
  title: string;
  description?: string;
  orgUnitId?: number;
  technicianId: number;
  statusId: number;
  openDate?: string;
  referenceExternal?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CaseFileListResponse = {
  items: CaseFileDto[];
  total: number;
};

export type CreateCaseFileDto = {
  code: string;
  title: string;
  description?: string;
  orgUnitId?: number;
  technicianId: number;
  statusId: number;
  openDate?: string;
  referenceExternal?: string;
};

export type UpdateCaseFileDto = Partial<{
  code: string;
  title: string;
  description: string;
  orgUnitId: number;
  technicianId: number;
  statusId: number;
  openDate: string;
  referenceExternal: string;
  isActive: boolean;
}>;

export const caseFileService = {
  async list(): Promise<CaseFileListResponse> {
    const { data } = await httpClient.get<CaseFileListResponse>("/api/case-files");
    return data;
  },

  async findOne(id: number): Promise<CaseFileDto> {
    const { data } = await httpClient.get<CaseFileDto>(`/api/case-files/${id}`);
    return data;
  },

  async create(payload: CreateCaseFileDto): Promise<CaseFileDto> {
    const { data } = await httpClient.post<CaseFileDto>(
      "/api/case-files",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateCaseFileDto): Promise<CaseFileDto> {
    const { data } = await httpClient.put<CaseFileDto>(
      `/api/case-files/${id}`,
      payload
    );
    return data;
  },

  async updatestatus(id: number, payload: UpdateCaseFileDto): Promise<CaseFileDto> {
    const { data } = await httpClient.patch<CaseFileDto>(
      `/api/case-files/${id}/status`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/case-files/${id}`);
  },
};
