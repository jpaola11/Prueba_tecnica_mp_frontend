import { httpClient } from "./httpClient";

export type EvidenceDto = {
  id: number;
  caseFileId: number;
  name: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: string;
  updatedAt?: string;
};

export type EvidenceListResponse = {
  items: EvidenceDto[];
  total: number;
};

export type CreateEvidenceDto = {
  caseFileId: number;
  name: string;
  description?: string;
  file?: File | null; // opcional, puede ser evidencia sin archivo
};

export type UpdateEvidenceDto = Partial<{
  name: string;
  description: string;
  file: File | null;
}>;

export const evidenceService = {
  async list(caseFileId?: number): Promise<EvidenceListResponse> {
    const { data } = await httpClient.get<EvidenceListResponse>(
      "/api/evidence",
      {
        params: { caseFileId },
      }
    );
    return data;
  },

  async findOne(id: number): Promise<EvidenceDto> {
    const { data } = await httpClient.get<EvidenceDto>(`/api/evidence/${id}`);
    return data;
  },

  async create(payload: CreateEvidenceDto): Promise<EvidenceDto> {
    const formData = new FormData();
    formData.append("caseFileId", String(payload.caseFileId));
    formData.append("name", payload.name);
    if (payload.description) formData.append("description", payload.description);
    if (payload.file) formData.append("file", payload.file);

    const { data } = await httpClient.post<EvidenceDto>(
      "/api/evidence",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  async update(id: number, payload: UpdateEvidenceDto): Promise<EvidenceDto> {
    const formData = new FormData();
    if (payload.name) formData.append("name", payload.name);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.file) formData.append("file", payload.file);

    const { data } = await httpClient.put<EvidenceDto>(
      `/api/evidence/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/evidence/${id}`);
  },
};
