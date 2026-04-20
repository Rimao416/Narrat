"use client";

import { useState } from "react";
import { useBooks } from "@/hooks/useContent";
import { ContentKanban } from "@/components/content/ContentKanban";
import { BookForm } from "@/components/content/BookForm";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ContentStatus, Book } from "@/types";
import { Search, Plus, List, LayoutGrid } from "lucide-react";
import { CATEGORY_LABELS, timeAgo } from "@/lib/utils";

const STATUS_FILTERS: { value: ContentStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "DRAFT", label: "Brouillon" },
  { value: "REVIEW", label: "En révision" },
  { value: "PUBLISHED", label: "Publié" },
  { value: "ARCHIVED", label: "Archivé" },
];

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED", "REJECTED"];

export default function BooksPage() {
  const { books, total, totalPages, loading, page, search, statusFilter,
    setPage, setSearch, setStatusFilter, updateStatus, reorder, deleteBook, refresh } = useBooks();

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showForm, setShowForm] = useState(false);

  const kanbanItems = books.map((b) => ({
    id: b.id,
    title: b.title,
    status: b.status,
    isFeatured: b.isFeatured,
    meta: `${CATEGORY_LABELS[b.category] ?? b.category} · ${b.author?.firstName} ${b.author?.lastName}`,
  }));

  const columns: Column<Book>[] = [
    {
      key: "title",
      header: "Titre",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.coverUrl
            ? <img src={row.coverUrl} alt="" className="w-8 h-10 rounded object-cover shrink-0 bg-muted" />
            : <div className="w-8 h-10 rounded bg-muted shrink-0" />}
          <div>
            <p className="font-medium text-sm">{row.title}</p>
            <p className="text-xs text-muted-foreground">{row.author?.firstName} {row.author?.lastName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Catégorie",
      cell: (row) => <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[row.category] ?? row.category}</span>,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "reads",
      header: "Lectures",
      cell: (row) => <span className="text-sm font-mono">{row.readCount}</span>,
    },
    {
      key: "updatedAt",
      header: "Modifié",
      cell: (row) => <span className="text-xs text-muted-foreground">{timeAgo(row.updatedAt)}</span>,
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
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
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
            placeholder="Rechercher un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter((e.target.value as ContentStatus) || undefined)}
          className="w-44"
        >
          {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 ml-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>

        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-3.5 h-3.5" />
          Nouveau livre
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{total} livre{total !== 1 ? "s" : ""}</p>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={books}
          loading={loading}
          emptyMessage="Aucun livre trouvé"
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={20}
          onPageChange={setPage}
        />
      ) : (
        <ContentKanban
          items={kanbanItems}
          loading={loading}
          onStatusChange={updateStatus}
          onReorder={reorder}
          onDelete={deleteBook}
        />
      )}

      <BookForm open={showForm} onClose={() => setShowForm(false)} onSuccess={refresh} />
    </div>
  );
}
