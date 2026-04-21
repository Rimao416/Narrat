"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseStats } from "@/types";
import { Users, CheckCircle2, TrendingUp, Brain, BarChart3 } from "lucide-react";

interface CourseStatsPanelProps {
  stats: CourseStats | null;
  onLoad: () => void;
}

export function CourseStatsPanel({ stats, onLoad }: CourseStatsPanelProps) {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  if (!stats) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const kpis = [
    {
      label: "Inscrits",
      value: stats.totalEnrolled,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Complétés",
      value: stats.completedCount,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Taux de complétion",
      value: `${Math.round(stats.completionRate)}%`,
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Score quiz moyen",
      value: `${Math.round(stats.avgQuizScore)}%`,
      icon: Brain,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progression moyenne */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Progression moyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avancement global</span>
              <span className="font-mono font-medium">{stats.avgProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${Math.min(stats.avgProgress, 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Réussite aux quiz</span>
              <span className="font-mono font-medium">{stats.quizPassRate}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${Math.min(stats.quizPassRate, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module completion breakdown */}
      {stats.moduleStats.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              Complétion par module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {stats.moduleStats.map((m) => {
                const pct = stats.totalEnrolled > 0
                  ? Math.round((m.completions / stats.totalEnrolled) * 100)
                  : 0;
                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-[70%]">
                        <span className="font-mono text-muted-foreground mr-1.5">
                          {String(m.moduleIndex + 1).padStart(2, "0")}
                        </span>
                        {m.title}
                      </span>
                      <span className="font-mono text-muted-foreground shrink-0">
                        {m.completions} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
