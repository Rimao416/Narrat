"use client";

import { useSongs } from "@/hooks/useContent";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ContentStatus, Song } from "@/types";
import { Search, Plus, Music } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];

export default function SongsPage() {
  const { songs, total, totalPages, loading, page, search, setPage, setSearch, updateStatus } = useSongs();

  const columns: Column<Song>[] = [
    {
      key: "song",
      header: "Chanson",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
            {row.albumArt
              ? <img src={row.albumArt} alt="" className="w-9 h-9 rounded-lg object-cover" />
              : <Music className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-medium text-sm">{row.title}</p>
            <p className="text-xs text-muted-foreground">{row.artist}</p>
          </div>
        </div>
      ),
    },
    {
      key: "style",
      header: "Style",
      cell: (row) => <span className="text-xs text-muted-foreground">{row.style}</span>,
    },
    {
      key: "language",
      header: "Langue",
      cell: (row) => <span className="text-xs font-mono">{row.language}</span>,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "plays",
      header: "Écoutes",
      cell: (row) => <span className="text-sm font-mono">{row.playCount}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <Select
          value={row.status}
          onChange={(e) => updateStatus(row.id, e.target.value as ContentStatus)}
          className="h-7 text-xs w-32 py-0"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      ),
      className: "w-36",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher une chanson..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8"
          />
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{total} chanson{total !== 1 ? "s" : ""}</span>
        <Button size="sm"><Plus className="w-3.5 h-3.5" />Ajouter</Button>
      </div>
      <DataTable
        columns={columns}
        data={songs}
        loading={loading}
        emptyMessage="Aucune chanson trouvée"
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={20}
        onPageChange={setPage}
      />
    </div>
  );
}
