"use client";

import { useState } from "react";
import { useCourses } from "@/hooks/useContent";
import { ContentKanban } from "@/components/content/ContentKanban";
import { CourseForm } from "@/components/content/CourseForm";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import type { ContentStatus, Course } from "@/types";
import { Search, Plus, List, LayoutGrid } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const LEVEL_BADGE: Record<string, { label: string; variant: "default" | "warning" | "destructive" | "success" }> = {
  BEGINNER: { label: "Débutant", variant: "success" },
  INTERMEDIATE: { label: "Intermédiaire", variant: "warning" },
  ADVANCED: { label: "Avancé", variant: "destructive" },
};

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED", "REJECTED"];

export default function CoursesPage() {
  const { courses, total, totalPages, loading, page, search, statusFilter,
    setPage, setSearch, setStatusFilter, updateStatus, reorder, deleteCourse, refresh } = useCourses();

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showForm, setShowForm] = useState(false);

  const kanbanItems = courses.map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    isFeatured: c.isFeatured,
    meta: `${LEVEL_BADGE[c.level]?.label ?? c.level} · ${c.moduleCount} modules · ${c.enrollCount} inscrits`,
  }));

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Formation",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.coverUrl
            ? <img src={row.coverUrl} alt="" className="w-10 h-10 rounded object-cover bg-muted" />
            : <div className="w-10 h-10 rounded bg-muted" />}
          <div>
            <p className="font-medium text-sm">{row.title}</p>
            <p className="text-xs text-muted-foreground">{row.moduleCount} modules · {row.estimatedHours}h</p>
          </div>
        </div>
      ),
    },
    {
      key: "level",
      header: "Niveau",
      cell: (row) => {
        const info = LEVEL_BADGE[row.level];
        return <Badge variant={info?.variant ?? "secondary"}>{info?.label ?? row.level}</Badge>;
      },
    },
    { key: "status", header: "Statut", cell: (row) => <StatusBadge status={row.status} /> },
    { key: "enrollments", header: "Inscrits", cell: (row) => <span className="text-sm font-mono">{row.enrollCount}</span> },
    { key: "updatedAt", header: "Modifié", cell: (row) => <span className="text-xs text-muted-foreground">{timeAgo(row.updatedAt)}</span> },
    {
      key: "actions", header: "",
      cell: (row) => (
        <Select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value as ContentStatus)} className="h-7 text-xs w-32 py-0">
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
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={statusFilter ?? ""} onChange={(e) => setStatusFilter((e.target.value as ContentStatus) || undefined)} className="w-44">
          <option value="">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 ml-auto">
          <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setViewMode("kanban")} className={`p-1.5 rounded-md transition-colors ${viewMode === "kanban" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-3.5 h-3.5" />Nouvelle formation</Button>
      </div>

      <p className="text-xs text-muted-foreground">{total} formation{total !== 1 ? "s" : ""}</p>

      {viewMode === "list" ? (
        <DataTable columns={columns} data={courses} loading={loading} emptyMessage="Aucune formation" page={page} totalPages={totalPages} total={total} pageSize={20} onPageChange={setPage} />
      ) : (
        <ContentKanban items={kanbanItems} loading={loading} onStatusChange={updateStatus} onReorder={reorder} onDelete={deleteCourse} />
      )}

      <CourseForm open={showForm} onClose={() => setShowForm(false)} onSuccess={refresh} />
    </div>
  );
}
