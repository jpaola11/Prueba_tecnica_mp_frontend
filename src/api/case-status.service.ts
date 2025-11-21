import { httpClient } from "./httpClient";

export type CaseStatusDto = {
  id: number;
  code: string;
  name: string;
  description?: string;

  isFinal: boolean;
  order?: number | null;

  createdAt: string;
  createdBy: number;
  updatedAt?: string | null;
  updatedBy?: number | null;

  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: number | null;
};

export type CaseStatusListResponse = {
  items: CaseStatusDto[];
  total: number;
};

export type CreateCaseStatusDto = {
  code: string;
  name: string;
  description?: string;
  isFinal?: boolean;
  order?: number | null;
};

export type UpdateCaseStatusDto = Partial<CreateCaseStatusDto>;

export const caseStatusService = {
  async list(): Promise<CaseStatusListResponse> {
    const { data } = await httpClient.get<CaseStatusListResponse>(
      "/api/case-statuses"
    );
    return data;
  },

  async findOne(id: number): Promise<CaseStatusDto> {
    const { data } = await httpClient.get<CaseStatusDto>(
      `/api/case-statuses/${id}`
    );
    return data;
  },

  async create(payload: CreateCaseStatusDto): Promise<CaseStatusDto> {
    const { data } = await httpClient.post<CaseStatusDto>(
      "/api/case-statuses",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateCaseStatusDto): Promise<CaseStatusDto> {
    const { data } = await httpClient.put<CaseStatusDto>(
      `/api/case-statuses/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/case-statuses/${id}`);
  },
};
