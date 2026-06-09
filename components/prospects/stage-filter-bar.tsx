"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn, getStageLabel } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/lib/constants";

interface StageFilterBarProps {
  stageCounts: Record<string, number>;
  activeStage?: string;
}

export function StageFilterBar({ stageCounts, activeStage }: StageFilterBarProps) {
  const total = Object.values(stageCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href="/prospects"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
          !activeStage
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
        )}
      >
        All
        <span className={cn(
          "inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-xs",
          !activeStage ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
        )}>
          {total}
        </span>
      </Link>
      {PIPELINE_STAGES.map((stage) => {
        const count = stageCounts[stage.key] ?? 0;
        const isActive = activeStage === stage.key;
        return (
          <Link
            key={stage.key}
            href={`/prospects?stage=${stage.key}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              isActive
                ? `${stage.color} text-white`
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            )}
          >
            {stage.label}
            <span className={cn(
              "inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-xs px-1",
              isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
