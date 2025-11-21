import { httpClient } from './httpClient';

export type ReportsFilter = {
  orgUnitId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export type CaseStatusSummaryRow = {
  orgUnitName: string;
  open: number;
  inProgress: number;
  closed: number;
  total: number;
};

export type CaseFileReportItem = {
  id: number;
  code: string;
  title: string;
  description: string;
  orgUnitId: number;
  technicianId: number;
  statusId: number;
  openDate: string;
  closeDate: string | null;
  referenceExternal: string | null;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
};

export type CaseFileReportResponse = {
  items: CaseFileReportItem[];
  total: number;
  page: number;
  limit: number;
};

export type CaseReviewReportItem = {
  id: number;
  caseId: number;
  reviewerId: number;
  previousStatusId: number;
  newStatusId: number;
  comment: string;
  reviewedAt: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string | null;
  updatedBy: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: number | null;
  caseCode: string;
  caseTitle: string;
  caseCurrentStatusId: number;
  reviewerUsername: string;
  reviewerFullName: string;
  previousStatusName: string;
  previousStatusCode: string;
  newStatusName: string;
  newStatusCode: string;
};

export const reportsService = {
  async caseStatusSummary(
    filters: ReportsFilter = {},
  ): Promise<CaseStatusSummaryRow[]> {
    const { data } = await httpClient.get<CaseStatusSummaryRow[]>(
      '/api/reports/case-status-summary',
      { params: filters },
    );
    return data;
  },

  async caseFiles(
    filters: ReportsFilter = {},
  ): Promise<CaseFileReportResponse> {
    const { data } = await httpClient.get<CaseFileReportResponse>(
      '/api/case-files',
      { params: filters },
    );
    return data;
  },
};
