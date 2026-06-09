"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { cn } from "@/lib/utils";

interface Stage {
  key: string;
  label: string;
  color: string;
  textColor: string;
  bg: string;
  border: string;
}

interface Prospect {
  id: string;
  restaurantName: string;
  branchName: string | null;
  area: string | null;
  contactPerson: string | null;
  phone: string | null;
  source: string | null;
  stage: string;
  priorityScore: number | null;
  updatedAt: Date;
  leadOwner: { name: string | null; image: string | null } | null;
  _count: { activities: number; followUps: number };
}

export function KanbanColumn({
  stage,
  prospects,
}: {
  stage: Stage;
  prospects: Prospect[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      {/* Column Header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl ${stage.bg} border ${stage.border} border-b-0`}>
        <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
        <span className={`text-xs font-semibold ${stage.textColor}`}>{stage.label}</span>
        <span className={`ml-auto text-xs font-bold ${stage.textColor} bg-white/50 px-1.5 py-0.5 rounded-full`}>
          {prospects.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 border rounded-b-xl overflow-y-auto min-h-[400px] transition-colors",
          stage.bg, stage.border,
          isOver && "ring-2 ring-indigo-400 ring-inset"
        )}
      >
        <SortableContext items={prospects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {prospects.map((prospect) => (
            <KanbanCard key={prospect.id} prospect={prospect} />
          ))}
        </SortableContext>
        {prospects.length === 0 && (
          <div className="h-16 flex items-center justify-center text-xs text-slate-400 italic border-2 border-dashed border-slate-200 rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
