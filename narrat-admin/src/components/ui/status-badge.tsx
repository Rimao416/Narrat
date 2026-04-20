import { Badge } from "./badge";
import { STATUS_LABELS, ROLE_LABELS } from "@/lib/utils";
import type { ContentStatus, UserRole } from "@/types";

export function StatusBadge({ status }: { status: ContentStatus }) {
  const variant =
    status === "PUBLISHED" ? "success"
    : status === "DRAFT" ? "secondary"
    : status === "REVIEW" ? "warning"
    : status === "REJECTED" ? "destructive"
    : "outline";
  return <Badge variant={variant}>{STATUS_LABELS[status] ?? status}</Badge>;
}

export function RoleBadge({ role }: { role: UserRole }) {
  const variant =
    role === "SUPER_ADMIN" ? "destructive"
    : role === "ADMIN" ? "default"
    : role === "MODERATOR" ? "warning"
    : role === "EDITOR" ? "success"
    : "secondary";
  return <Badge variant={variant}>{ROLE_LABELS[role] ?? role}</Badge>;
}
