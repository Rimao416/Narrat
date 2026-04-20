import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analytics.service";
import type { DashboardStats, ChartDataPoint } from "@/types";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/api";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growth, setGrowth] = useState<ChartDataPoint[]>([]);
  const [engagement, setEngagement] = useState<{ module: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, g, e] = await Promise.all([
          analyticsService.dashboardStats(),
          analyticsService.userGrowth(period),
          analyticsService.engagementByModule(),
        ]);
        setStats(s);
        setGrowth(g);
        setEngagement(e);
      } catch (err) {
        toast.error(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  return { stats, growth, engagement, loading, period, setPeriod };
}
