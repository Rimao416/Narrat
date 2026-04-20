"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/ui/sortable-item";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ContentStatus } from "@/types";
import { useState } from "react";
import { Pencil, Trash2, Star, StarOff } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  isFeatured?: boolean;
  meta?: string;
}

interface ContentKanbanProps {
  items: ContentItem[];
  loading?: boolean;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onReorder: (ids: string[]) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
}

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED", "REJECTED"];

export function ContentKanban({
  items,
  loading,
  onStatusChange,
  onReorder,
  onDelete,
  onEdit,
  onToggleFeatured,
}: ContentKanbanProps) {
  const [localItems, setLocalItems] = useState(items);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((i) => i.id === active.id);
    const newIndex = localItems.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(reordered);
    onReorder(reordered.map((i) => i.id));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1.5">
          {localItems.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2.5 hover:border-border/80 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{item.title}</p>
                  {item.meta && (
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={item.status} />
                  <Select
                    value={item.status}
                    onChange={(e) => onStatusChange(item.id, e.target.value as ContentStatus)}
                    className="h-7 text-xs w-32 py-0"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  {onToggleFeatured && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleFeatured(item.id, !item.isFeatured)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {item.isFeatured
                        ? <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        : <StarOff className="w-3.5 h-3.5 text-muted-foreground" />}
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
