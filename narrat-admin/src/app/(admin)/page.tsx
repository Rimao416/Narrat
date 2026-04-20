"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import {
  Users,
  BookOpen,
  GraduationCap,
  MessageSquareHeart,
  Flag,
  Layers,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { stats, growth, engagement, loading, period, setPeriod } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total utilisateurs"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          loading={loading}
          trend={{ value: 12, label: "ce mois" }}
        />
        <StatsCard
          label="Actifs aujourd'hui"
          value={stats?.activeUsersToday ?? 0}
          icon={UserCheck}
          variant="success"
          loading={loading}
        />
        <StatsCard
          label="Nouveaux (7j)"
          value={stats?.newUsersThisWeek ?? 0}
          icon={TrendingUp}
          variant="success"
          loading={loading}
        />
        <StatsCard
          label="Signalements en attente"
          value={stats?.pendingReports ?? 0}
          icon={Flag}
          variant={stats && stats.pendingReports > 0 ? "danger" : "default"}
          loading={loading}
        />
        <StatsCard
          label="Livres"
          value={stats?.totalBooks ?? 0}
          icon={BookOpen}
          loading={loading}
        />
        <StatsCard
          label="Formations"
          value={stats?.totalCourses ?? 0}
          icon={GraduationCap}
          loading={loading}
        />
        <StatsCard
          label="Confessions"
          value={stats?.totalConfessions ?? 0}
          icon={MessageSquareHeart}
          loading={loading}
        />
        <StatsCard
          label="Contenu en attente"
          value={stats?.pendingContent ?? 0}
          icon={Layers}
          variant={stats && stats.pendingContent > 0 ? "warning" : "default"}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GrowthChart
          data={growth}
          loading={loading}
          period={period}
          onPeriodChange={setPeriod}
        />
        <EngagementChart data={engagement} loading={loading} />
      </div>
    </div>
  );
}
