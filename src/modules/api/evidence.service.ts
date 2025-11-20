import { httpClient } from './httpClient';

export type EvidenceDto = {
  id: number;
  caseFileId: number;
  caseCode: string;
  type: string;
  description?: string;
  registeredAt: string;
  location?: string;
  fileUrl?: string;
};

export type EvidenceQueryDto = {
  caseCode?: string;
  type?: string;
};

export type CreateEvidenceDto = {
  caseFileId: number;
  type: string;
  description?: string;
  location?: string;
  fileUrl?: string;
};

export type UpdateEvidenceDto = Partial<CreateEvidenceDto>;

export const evidenceService = {
  async list(query: EvidenceQueryDto = {}): Promise<EvidenceDto[]> {
    const { data } = await httpClient.get<EvidenceDto[]>('/evidence', { params: query });
    return data;
  },

  async findOne(id: number): Promise<EvidenceDto> {
    const { data } = await httpClient.get<EvidenceDto>(`/evidence/${id}`);
    return data;
  },

  async create(payload: CreateEvidenceDto): Promise<EvidenceDto> {
    const { data } = await httpClient.post<EvidenceDto>('/evidence', payload);
    return data;
  },

  async update(id: number, payload: UpdateEvidenceDto): Promise<EvidenceDto> {
    const { data } = await httpClient.put<EvidenceDto>(`/evidence/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/evidence/${id}`);
  },
};
