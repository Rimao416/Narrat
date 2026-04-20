import { api } from "./api";
import type { DashboardStats, ChartDataPoint } from "@/types";

export const analyticsService = {
  async dashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get("/admin/analytics/stats");
    return data;
  },

  async userGrowth(period: "7d" | "30d" | "90d"): Promise<ChartDataPoint[]> {
    const { data } = await api.get("/admin/analytics/user-growth", { params: { period } });
    return data;
  },

  async engagementByModule(): Promise<{ module: string; count: number }[]> {
    const { data } = await api.get("/admin/analytics/engagement");
    return data;
  },

  async topContent(type: "books" | "courses" | "songs"): Promise<{ id: string; title: string; count: number }[]> {
    const { data } = await api.get("/admin/analytics/top-content", { params: { type } });
    return data;
  },
};
