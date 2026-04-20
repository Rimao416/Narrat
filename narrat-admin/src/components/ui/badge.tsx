import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "success" | "warning" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary/15 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
  destructive: "bg-destructive/15 text-destructive border-destructive/20",
  success: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  outline: "bg-transparent text-foreground border-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
