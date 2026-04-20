"use client";

import { useState, useCallback, useEffect } from "react";
import { confessionsService } from "@/services/moderation.service";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import type { Confession, PaginatedResponse } from "@/types";
import { Search, CheckCircle, Flag, Trash2, Eye } from "lucide-react";
import { timeAgo, initials } from "@/lib/utils";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/api";

const TYPE_LABELS: Record<string, string> = {
  CONFESSION: "Confession",
  TESTIMONY: "Témoignage",
  PRAYER_REQUEST: "Prière",
  PRAISE: "Louange",
  QUESTION: "Question",
};

const TYPE_VARIANTS: Record<string, "default" | "secondary" | "success" | "warning"> = {
  CONFESSION: "warning",
  TESTIMONY: "success",
  PRAYER_REQUEST: "default",
  PRAISE: "success",
  QUESTION: "secondary",
};

export default function ConfessionsPage() {
  const [data, setData] = useState<PaginatedResponse<Confession> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged" | "pending">("all");
  const [selected, setSelected] = useState<Confession | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await confessionsService.list({
        page,
        pageSize: 20,
        isFlagged: filter === "flagged" ? true : undefined,
        isApproved: filter === "pending" ? false : undefined,
      });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (id: string) => {
    try { await confessionsService.approve(id); toast.success("Approuvée"); fetch(); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const flag = async (id: string) => {
    try { await confessionsService.flag(id); toast.success("Signalée"); fetch(); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const remove = async (id: string) => {
    try { await confessionsService.delete(id); toast.success("Supprimée"); fetch(); }
    catch (err) { toast.error(extractErrorMessage(err)); }
  };

  const columns: Column<Confession>[] = [
    {
      key: "author",
      header: "Auteur",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
            {initials(row.user.firstName, row.user.lastName)}
          </div>
          <span className="text-sm text-foreground">{row.user.firstName} {row.user.lastName}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <Badge variant={TYPE_VARIANTS[row.type] ?? "secondary"}>
          {TYPE_LABELS[row.type] ?? row.type}
        </Badge>
      ),
    },
    {
      key: "content",
      header: "Contenu",
      cell: (row) => (
        <p className="text-sm text-muted-foreground truncate max-w-xs">{row.content}</p>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          {row.isFlagged && <Badge variant="destructive">Signalé</Badge>}
          {!row.isApproved && !row.isFlagged && <Badge variant="warning">En attente</Badge>}
          {row.isApproved && !row.isFlagged && <Badge variant="success">Approuvé</Badge>}
        </div>
      ),
    },
    {
      key: "stats",
      header: "Stats",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.prayerCount} prières · {row.replyCount} réponses
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="text-xs text-muted-foreground">{timeAgo(row.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => setSelected(row)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          {!row.isApproved && (
            <Button variant="ghost" size="icon" onClick={() => approve(row.id)}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => flag(row.id)}>
            <Flag className="w-3.5 h-3.5 text-amber-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => remove(row.id)}>
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </Button>
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {(["all", "flagged", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Tous" : f === "flagged" ? "Signalés" : "En attente"}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{data?.total ?? 0} entrées</span>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={loading}
        emptyMessage="Aucune confession trouvée"
        page={page}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        pageSize={20}
        onPageChange={setPage}
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail" size="md">
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={TYPE_VARIANTS[selected.type] ?? "secondary"}>
                {TYPE_LABELS[selected.type] ?? selected.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{timeAgo(selected.createdAt)}</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-foreground leading-relaxed">{selected.content}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {!selected.isApproved && (
                <Button size="sm" variant="secondary" onClick={() => { approve(selected.id); setSelected(null); }}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approuver
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => { remove(selected.id); setSelected(null); }}>
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
