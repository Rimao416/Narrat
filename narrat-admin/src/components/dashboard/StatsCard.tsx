import { cn, formatNumber } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "warning" | "success" | "danger";
  loading?: boolean;
}

const variantAccent: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-500",
  success: "bg-emerald-500/10 text-emerald-500",
  danger: "bg-destructive/10 text-destructive",
};

export function StatsCard({ label, value, icon: Icon, trend, variant = "default", loading }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", variantAccent[variant])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        {loading ? (
          <div className="h-7 w-20 rounded bg-muted animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-foreground leading-none">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
        )}
        {trend && !loading && (
          <p className={cn("text-xs mt-1", trend.value >= 0 ? "text-emerald-500" : "text-destructive")}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
