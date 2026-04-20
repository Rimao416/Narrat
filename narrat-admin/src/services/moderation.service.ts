import { api } from "./api";
import type { Confession, Report, PaginatedResponse, PaginationParams } from "@/types";

export const confessionsService = {
  async list(params: PaginationParams & { isFlagged?: boolean; isApproved?: boolean }): Promise<PaginatedResponse<Confession>> {
    const { data } = await api.get("/admin/confessions", { params });
    return data;
  },

  async approve(id: string): Promise<void> {
    await api.post(`/admin/confessions/${id}/approve`);
  },

  async flag(id: string): Promise<void> {
    await api.post(`/admin/confessions/${id}/flag`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/confessions/${id}`);
  },
};

export const reportsService = {
  async list(params: PaginationParams & { status?: string }): Promise<PaginatedResponse<Report>> {
    const { data } = await api.get("/admin/reports", { params });
    return data;
  },

  async resolve(id: string, action: string, notes?: string): Promise<void> {
    await api.post(`/admin/reports/${id}/resolve`, { action, notes });
  },

  async dismiss(id: string): Promise<void> {
    await api.post(`/admin/reports/${id}/dismiss`);
  },
};
