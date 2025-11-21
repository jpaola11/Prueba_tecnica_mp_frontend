import { httpClient } from "./httpClient";

export type AuditLogDto = {
  id: number;
  userId: number;
  action: string;
  module: string;
  entityId?: number;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string; // ISO 8601
};

export type AuditLogListResponse = {
  items: AuditLogDto[];
  total: number;
};

export type AuditLogQuery = {
  page?: number;
  limit?: number;
  module?: string;
  action?: string;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
};

export const auditLogService = {
  async list(query: AuditLogQuery = {}): Promise<AuditLogListResponse> {
    const { data } = await httpClient.get<AuditLogListResponse>(
      "/api/audit-log",
      { params: query }
    );
    return data;
  },

  async findOne(id: number): Promise<AuditLogDto> {
    const { data } = await httpClient.get<AuditLogDto>(
      `/api/audit-log/${id}`
    );
    return data;
  },
};
