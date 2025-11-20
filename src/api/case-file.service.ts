import { httpClient } from './httpClient';

export type CaseFileDto = {
  id: number;
  code: string;
  title: string;
  orgUnitName: string;
  status: string;
  technicianName?: string;
  openDate: string;
};

export type CaseFileQuery = {
  code?: string;
  orgUnitId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

export const caseFileService = {
  async search(query: CaseFileQuery): Promise<CaseFileDto[]> {
    const { data } = await httpClient.get<CaseFileDto[]>('/case-files', {
      params: query,
    });
    return data;
  },
};
