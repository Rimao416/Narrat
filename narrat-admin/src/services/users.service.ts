import { api } from "./api";
import type { AdminUser, PaginatedResponse, PaginationParams, UserRole } from "@/types";

export const usersService = {
  async list(params: PaginationParams & { role?: UserRole; isBanned?: boolean }): Promise<PaginatedResponse<AdminUser>> {
    const { data } = await api.get("/admin/users", { params });
    return data;
  },

  async get(id: string): Promise<AdminUser> {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  async updateRole(id: string, role: UserRole): Promise<AdminUser> {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
  },

  async ban(id: string, reason: string): Promise<void> {
    await api.post(`/admin/users/${id}/ban`, { reason });
  },

  async unban(id: string): Promise<void> {
    await api.post(`/admin/users/${id}/unban`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async stats(): Promise<{ total: number; newThisWeek: number; activeToday: number; byRole: Record<string, number> }> {
    const { data } = await api.get("/admin/users/stats");
    return data;
  },
};
