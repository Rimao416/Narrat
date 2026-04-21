"use client";

import { useState, useCallback, useEffect } from "react";
import { api, extractErrorMessage } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { ContentKanban } from "@/components/content/ContentKanban";
import { ChallengeForm } from "@/components/content/ChallengeForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Challenge, ContentStatus, PaginatedResponse } from "@/types";
import { Search, Plus, List, LayoutGrid } from "lucide-react";
import { CHALLENGE_CATEGORY_LABELS } from "@/lib/utils";
import { toast } from "sonner";

const INTENSITY_VARIANTS = {
  LIGHT: "success" as const,
  MODERATE: "warning" as const,
  INTENSE: "destructive" as const,
};
const INTENSITY_LABELS = { LIGHT: "Léger", MODERATE: "Modéré", INTENSE: "Intense" };

export default function ChallengesPage() {
  const [data, setData] = useState<PaginatedResponse<Challenge> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showForm, setShowForm] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/challenges", { params: { page, pageSize: 20, search: debouncedSearch || undefined } });
      setData(res.data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const updateStatus = async (id: string, status: ContentStatus) => {
    try {
      await api.patch(`/admin/challenges/${id}/status`, { status });
      toast.success("Statut mis à jour");
      fetch();
    } catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const reorder = async (ids: string[]) => {
    try { await api.post("/admin/challenges/reorder", { ids }); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const challenges: Challenge[] = data?.data ?? [];
  const kanbanItems = challenges.map((c) => ({
    id: c.id, title: c.title, status: c.status, isFeatured: false,
    meta: `${CHALLENGE_CATEGORY_LABELS[c.category] ?? c.category} · ${c.durationDays}j · ${c.participantCount} participants`,
  }));

  const columns: Column<Challenge>[] = [
    {
      key: "challenge", header: "Défi",
      cell: (row) => (
        <div>
          <p className="font-medium text-sm">{row.title}</p>
          <p className="text-xs text-muted-foreground">{CHALLENGE_CATEGORY_LABELS[row.category]} · {row.durationDays}j</p>
        </div>
      ),
    },
    {
      key: "intensity", header: "Intensité",
      cell: (row) => <Badge variant={INTENSITY_VARIANTS[row.intensity] ?? "default"}>{INTENSITY_LABELS[row.intensity] ?? row.intensity}</Badge>,
    },
    { key: "status", header: "Statut", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "participants", header: "Participants", cell: (row) => <span className="text-sm font-mono">{row.participantCount}</span> },
    {
      key: "actions", header: "",
      cell: (row) => (
        <select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value as ContentStatus)} className="h-7 px-2 rounded-md border border-input bg-background text-xs">
          {["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
      className: "w-36",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Rechercher un défi..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 ml-auto">
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode("kanban")} className={`p-1.5 rounded-md transition-colors ${viewMode === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-3.5 h-3.5" />Nouveau défi</Button>
      </div>

      <p className="text-xs text-muted-foreground">{data?.total ?? 0} défi{(data?.total ?? 0) !== 1 ? "s" : ""}</p>

      {viewMode === "list" ? (
        <DataTable columns={columns} data={challenges} loading={loading} emptyMessage="Aucun défi" page={page} totalPages={data?.totalPages ?? 1} total={data?.total ?? 0} pageSize={20} onPageChange={setPage} />
      ) : (
        <ContentKanban items={kanbanItems} loading={loading} onStatusChange={updateStatus} onReorder={reorder} />
      )}

      <ChallengeForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetch} />
    </div>
  );
}
