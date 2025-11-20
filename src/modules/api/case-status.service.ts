import { httpClient } from './httpClient';

export type CaseStatusDto = {
  id: number;
  code: string;
  name: string;
  description?: string;
  isFinal?: boolean;
  isDefault?: boolean;
};

export type CreateCaseStatusDto = {
  code: string;
  name: string;
  description?: string;
  isFinal?: boolean;
  isDefault?: boolean;
};

export type UpdateCaseStatusDto = Partial<CreateCaseStatusDto>;

export const caseStatusService = {
  async list(): Promise<CaseStatusDto[]> {
    const { data } = await httpClient.get<CaseStatusDto[]>('/case-status');
    return data;
  },

  async findOne(id: number): Promise<CaseStatusDto> {
    const { data } = await httpClient.get<CaseStatusDto>(`/case-status/${id}`);
    return data;
  },

  async create(payload: CreateCaseStatusDto): Promise<CaseStatusDto> {
    const { data } = await httpClient.post<CaseStatusDto>('/case-status', payload);
    return data;
  },

  async update(id: number, payload: UpdateCaseStatusDto): Promise<CaseStatusDto> {
    const { data } = await httpClient.put<CaseStatusDto>(`/case-status/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/case-status/${id}`);
  },
};
