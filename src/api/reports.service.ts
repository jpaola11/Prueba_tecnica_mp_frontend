import { httpClient } from './httpClient';

export type CaseStatusSummaryRow = {
  orgUnitName: string;
  open: number;
  inProgress: number;
  closed: number;
  total: number;
};

export type ReportsFilter = {
  orgUnitId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export const reportsService = {
  async caseStatusSummary(filter: ReportsFilter): Promise<CaseStatusSummaryRow[]> {
    const { data } = await httpClient.get<CaseStatusSummaryRow[]>('/reports/case-status', {
      params: filter,
    });
    return data;
  },
};
