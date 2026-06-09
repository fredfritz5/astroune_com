"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { updateProspectStage } from "@/app/actions/prospects";
import { PIPELINE_STAGES } from "@/lib/constants";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { toast } from "sonner";

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

export function KanbanBoard({ initialProspects }: { initialProspects: Prospect[] }) {
  const [prospects, setProspects] = useState(initialProspects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeProspect = activeId ? prospects.find((p) => p.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const prospectId = active.id as string;
    const newStage = over.id as string;
    const prospect = prospects.find((p) => p.id === prospectId);

    if (!prospect || prospect.stage === newStage) return;

    // Optimistic update
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, stage: newStage } : p))
    );

    startTransition(async () => {
      try {
        await updateProspectStage({ prospectId, stage: newStage });
        toast.success(`Moved to ${PIPELINE_STAGES.find((s) => s.key === newStage)?.label}`);
      } catch {
        // Revert
        setProspects(initialProspects);
        toast.error("Failed to update stage");
      }
    });
  }

  const stageProspects = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.key] = prospects.filter((p) => p.stage === stage.key);
    return acc;
  }, {} as Record<string, Prospect[]>);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.key}
            stage={stage}
            prospects={stageProspects[stage.key] ?? []}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProspect && <KanbanCard prospect={activeProspect} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
