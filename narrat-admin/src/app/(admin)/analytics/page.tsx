"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, BookOpen, GraduationCap, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { stats, growth, engagement, loading, period, setPeriod } = useDashboard();

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total utilisateurs" value={stats?.totalUsers ?? 0} icon={Users} loading={loading} />
        <StatsCard label="Actifs aujourd'hui" value={stats?.activeUsersToday ?? 0} icon={Activity} variant="success" loading={loading} />
        <StatsCard label="Livres" value={stats?.totalBooks ?? 0} icon={BookOpen} loading={loading} />
        <StatsCard label="Formations" value={stats?.totalCourses ?? 0} icon={GraduationCap} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GrowthChart data={growth} loading={loading} period={period} onPeriodChange={setPeriod} />
        <EngagementChart data={engagement} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par niveau spirituel</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: "Nouveau croyant", value: 35, color: "bg-emerald-500" },
                  { label: "Croyant", value: 40, color: "bg-primary" },
                  { label: "Établi", value: 15, color: "bg-violet-500" },
                  { label: "Leader", value: 7, color: "bg-amber-500" },
                  { label: "Pasteur", value: 3, color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité par langue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: "Français (FR)", value: 60, color: "bg-primary" },
                  { label: "Anglais (EN)", value: 25, color: "bg-cyan-500" },
                  { label: "Lingala (LN)", value: 10, color: "bg-amber-500" },
                  { label: "Swahili (SW)", value: 5, color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
