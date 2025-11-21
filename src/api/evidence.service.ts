import { httpClient } from "./httpClient";

export type EvidenceDto = {
  id: number;
  caseId: number;
  seqNumber: number;
  description: string;
  color?: string;
  sizeText?: string;
  weightValue?: number;
  weightUnit?: string;
  location?: string;
  technicianId: number;
  observations?: string;

  fileUrl?: string;
  fileType?: string;

  caseCode?: string;

  createdAt: string;
  updatedAt?: string;
};

export type EvidenceListResponse = {
  items: EvidenceDto[];
  total: number;
};

export type CreateEvidenceDto = {
  caseId: number;
  seqNumber: number;
  description: string;
  color?: string;
  sizeText?: string;
  weightValue?: number;
  weightUnit?: string;
  location?: string;
  technicianId: number;
  observations?: string;
};

export type UpdateEvidenceDto = Partial<Omit<CreateEvidenceDto, "caseId">>;

export const evidenceService = {
  async list(caseId?: number): Promise<EvidenceListResponse> {
    const { data } = await httpClient.get<EvidenceListResponse>(
      "/api/evidences",
      { params: { caseId } }
    );
    return data;
  },

  async findOne(id: number): Promise<EvidenceDto> {
    const { data } = await httpClient.get<EvidenceDto>(`/api/evidences/${id}`);
    return data;
  },

  async create(payload: CreateEvidenceDto): Promise<EvidenceDto> {
    const { data } = await httpClient.post<EvidenceDto>(
      "/api/evidences",
      payload,  
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    return data;
  },
  

  async update(id: number, payload: UpdateEvidenceDto): Promise<EvidenceDto> {
    const formData = new FormData();

    
    if (payload.seqNumber !== undefined) {
      formData.append("seqNumber", String(payload.seqNumber));
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description);
    }
    if (payload.color !== undefined) {
      formData.append("color", payload.color);
    }
    if (payload.sizeText !== undefined) {
      formData.append("sizeText", payload.sizeText);
    }
    if (payload.weightValue !== undefined) {
      formData.append("weightValue", String(payload.weightValue));
    }
    if (payload.weightUnit !== undefined) {
      formData.append("weightUnit", payload.weightUnit);
    }
    if (payload.location !== undefined) {
      formData.append("location", payload.location);
    }
    if (payload.technicianId !== undefined) {
      formData.append("technicianId", String(payload.technicianId));
    }
    if (payload.observations !== undefined) {
      formData.append("observations", payload.observations);
    }
   

    const { data } = await httpClient.put<EvidenceDto>(
      `/api/evidences/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/evidences/${id}`);
  },
};
