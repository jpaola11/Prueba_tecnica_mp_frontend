import { httpClient } from "./httpClient";

export type CaseStatusDto = {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export type CaseStatusListResponse = {
  items: CaseStatusDto[];
  total: number;
};

export type CreateCaseStatusDto = {
  code: string;
  name: string;
  description?: string;
};

export type UpdateCaseStatusDto = Partial<{
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}>;

export const caseStatusService = {
  async list(): Promise<CaseStatusListResponse> {
    const { data } = await httpClient.get<CaseStatusListResponse>(
      "/api/case-status"
    );
    return data;
  },

  async findOne(id: number): Promise<CaseStatusDto> {
    const { data } = await httpClient.get<CaseStatusDto>(
      `/api/case-status/${id}`
    );
    return data;
  },

  async create(payload: CreateCaseStatusDto): Promise<CaseStatusDto> {
    const { data } = await httpClient.post<CaseStatusDto>(
      "/api/case-status",
      payload
    );
    return data;
  },

  async update(
    id: number,
    payload: UpdateCaseStatusDto
  ): Promise<CaseStatusDto> {
    const { data } = await httpClient.put<CaseStatusDto>(
      `/api/case-status/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/case-status/${id}`);
  },
};
