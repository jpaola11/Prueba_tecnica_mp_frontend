import { httpClient } from "./httpClient";

export type CaseReviewDto = {
  id: number;
  caseFileId: number;
  reviewerId: number;
  comments: string;
  statusId: number;
  createdAt: string;
  updatedAt?: string;
};

export type CaseReviewListResponse = {
  items: CaseReviewDto[];
  total: number;
};

export type CreateCaseReviewDto = {
  caseFileId: number;
  reviewerId: number;
  comments: string;
  statusId: number;
};

export type UpdateCaseReviewDto = Partial<{
  comments: string;
  statusId: number;
}>;

export const caseReviewService = {
  async list(caseFileId?: number): Promise<CaseReviewListResponse> {
    const { data } = await httpClient.get<CaseReviewListResponse>(
      "/api/cases-review",
      { params: { caseFileId } }
    );
    return data;
  },

  async findOne(id: number): Promise<CaseReviewDto> {
    const { data } = await httpClient.get<CaseReviewDto>(
      `/api/cases-review/${id}`
    );
    return data;
  },

  async create(payload: CreateCaseReviewDto): Promise<CaseReviewDto> {
    const { data } = await httpClient.post<CaseReviewDto>(
      "/api/cases-review",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateCaseReviewDto): Promise<CaseReviewDto> {
    const { data } = await httpClient.put<CaseReviewDto>(
      `/api/cases-review/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/cases-review/${id}`);
  },
};
