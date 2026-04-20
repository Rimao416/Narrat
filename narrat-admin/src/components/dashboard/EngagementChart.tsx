"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = [
  "hsl(var(--primary))",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
];

interface EngagementChartProps {
  data: { module: string; count: number }[];
  loading?: boolean;
}

const MODULE_LABELS: Record<string, string> = {
  library: "Bibliothèque",
  formation: "Formation",
  confessions: "Confessions",
  prayer: "Prière",
  worship: "Louange",
  challenges: "Défis",
  quiz: "Quiz",
  ai: "IA",
};

export function EngagementChart({ data, loading }: EngagementChartProps) {
  const formatted = data.map((d) => ({ ...d, module: MODULE_LABELS[d.module] ?? d.module }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement par module</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 rounded bg-muted animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="module"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [v, "Sessions"]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {formatted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
