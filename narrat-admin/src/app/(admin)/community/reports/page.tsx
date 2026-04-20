"use client";

import { useState, useCallback, useEffect } from "react";
import { reportsService } from "@/services/moderation.service";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import type { Report, PaginatedResponse } from "@/types";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/api";

const REASON_LABELS: Record<string, string> = {
  INAPPROPRIATE_CONTENT: "Contenu inapproprié",
  SPAM: "Spam",
  HARASSMENT: "Harcèlement",
  FAKE_INFO: "Fausse info",
  OTHER: "Autre",
};

const STATUS_VARIANTS: Record<string, "default" | "success" | "secondary" | "warning" | "destructive"> = {
  PENDING: "warning",
  REVIEWED: "default",
  RESOLVED: "success",
  DISMISSED: "secondary",
};

export default function ReportsPage() {
  const [data, setData] = useState<PaginatedResponse<Report> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Report | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportsService.list({ page, pageSize: 20 });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetch(); }, [fetch]);

  const resolve = async (id: string, action: string, notes?: string) => {
    try { await reportsService.resolve(id, action, notes); toast.success("Résolu"); fetch(); setSelected(null); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const dismiss = async (id: string) => {
    try { await reportsService.dismiss(id); toast.success("Rejeté"); fetch(); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const columns: Column<Report>[] = [
    {
      key: "reporter",
      header: "Signalé par",
      cell: (row) => (
        <span className="text-sm">{row.reporter.firstName} {row.reporter.lastName}</span>
      ),
    },
    {
      key: "reason",
      header: "Raison",
      cell: (row) => <span className="text-sm">{REASON_LABELS[row.reason] ?? row.reason}</span>,
    },
    {
      key: "target",
      header: "Cible",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.reportedUser
            ? `${row.reportedUser.firstName} ${row.reportedUser.lastName}`
            : row.confession
            ? `Confession: ${row.confession.content.slice(0, 40)}…`
            : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge variant={STATUS_VARIANTS[row.status] ?? "default"}>{row.status}</Badge>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="text-xs text-muted-foreground">{timeAgo(row.reportedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => { setSelected(row); setResolveNotes(""); }}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          {row.status === "PENDING" && (
            <>
              <Button variant="ghost" size="icon" onClick={() => resolve(row.id, "RESOLVED")}>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => dismiss(row.id)}>
                <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{data?.total ?? 0} signalement{(data?.total ?? 0) !== 1 ? "s" : ""}</span>
        {(data?.data.filter((r) => r.status === "PENDING").length ?? 0) > 0 && (
          <Badge variant="destructive">
            {data?.data.filter((r) => r.status === "PENDING").length} en attente
          </Badge>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={loading}
        emptyMessage="Aucun signalement"
        page={page}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        pageSize={20}
        onPageChange={setPage}
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail du signalement" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Raison</p>
                <p className="font-medium">{REASON_LABELS[selected.reason]}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Statut</p>
                <p className="font-medium">{selected.status}</p>
              </div>
            </div>
            {selected.description && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selected.description}</p>
              </div>
            )}
            {selected.confession && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Contenu signalé</p>
                <p className="text-sm">{selected.confession.content}</p>
              </div>
            )}
            {selected.status === "PENDING" && (
              <div className="space-y-2">
                <label className="text-xs font-medium">Notes de résolution</label>
                <Input
                  placeholder="Optionnel..."
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => resolve(selected.id, "RESOLVED", resolveNotes)}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Résoudre
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => dismiss(selected.id)}>
                    Rejeter
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
