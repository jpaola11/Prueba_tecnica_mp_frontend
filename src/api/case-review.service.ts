import { httpClient } from "./httpClient";

export type CaseReviewDto = {
  id: number;
  caseId: number;
  comment: string;
  previousStatusId: 1;
  newStatusId: number;
  reviewerId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CaseReviewListResponse = {
  items: CaseReviewDto[];
  total: number;
};

export type CreateCaseReviewDto = {
  caseId: number;
  comment: string;
  newStatusId: number;
  previousStatusId: 1;
  reviewerId: number;


};

export type UpdateCaseReviewDto = Partial<{
  comments: string;
  statusId: number;
}>;

export const caseReviewService = {
  async list(caseFileId?: number): Promise<CaseReviewListResponse> {
    const { data } = await httpClient.get<CaseReviewListResponse>(
      "/api/case-reviews",
      { params: { caseFileId } }
    );
    return data;
  },

  async findOne(id: number): Promise<CaseReviewDto> {
    const { data } = await httpClient.get<CaseReviewDto>(
      `/api/case-reviews/${id}`
    );
    return data;
  },

  async create(payload: CreateCaseReviewDto): Promise<CaseReviewDto> {
    const { data } = await httpClient.post<CaseReviewDto>(
      "/api/case-reviews",
      payload
    );
    return data;
  },

  async update(id: number, payload: UpdateCaseReviewDto): Promise<CaseReviewDto> {
    const { data } = await httpClient.put<CaseReviewDto>(
      `/api/case-reviews/${id}`,
      payload
    );
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/api/case-reviews/${id}`);
  },
};
