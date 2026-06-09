"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn, getInitials, getSourceLabel } from "@/lib/utils";
import { MapPin, Bell, Activity, GripVertical } from "lucide-react";

interface KanbanCardProps {
  prospect: {
    id: string;
    restaurantName: string;
    branchName: string | null;
    area: string | null;
    contactPerson: string | null;
    source: string | null;
    priorityScore: number | null;
    leadOwner: { name: string | null; image: string | null } | null;
    _count: { activities: number; followUps: number };
  };
  isDragging?: boolean;
}

export function KanbanCard({ prospect, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: prospect.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isHighPriority = (prospect.priorityScore ?? 0) >= 8;
  const isMediumPriority = (prospect.priorityScore ?? 0) >= 5;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow",
        isDragging || isSortableDragging
          ? "opacity-50 border-indigo-400 shadow-lg"
          : "border-slate-200",
        isHighPriority && "border-l-4 border-l-red-400",
        !isHighPriority && isMediumPriority && "border-l-4 border-l-amber-400"
      )}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div
            {...attributes}
            {...listeners}
            className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/prospects/${prospect.id}`}
              className="text-xs font-semibold text-slate-800 hover:text-indigo-600 transition-colors block truncate"
            >
              {prospect.restaurantName}
            </Link>
            {prospect.branchName && (
              <p className="text-xs text-slate-400 truncate">{prospect.branchName}</p>
            )}
          </div>
          {prospect.leadOwner?.name && (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600 flex-shrink-0">
              {getInitials(prospect.leadOwner.name)}
            </div>
          )}
        </div>

        {prospect.contactPerson && (
          <p className="text-xs text-slate-500 mt-1.5 ml-5 truncate">{prospect.contactPerson}</p>
        )}

        <div className="flex items-center gap-2 mt-2 ml-5 flex-wrap">
          {prospect.area && (
            <span className="flex items-center gap-0.5 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {prospect.area}
            </span>
          )}
          {prospect.source && (
            <span className="text-xs text-slate-400">{getSourceLabel(prospect.source)}</span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2 ml-5">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Activity className="w-3 h-3" />
            {prospect._count.activities}
          </span>
          {prospect._count.followUps > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
              <Bell className="w-3 h-3" />
              {prospect._count.followUps}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
