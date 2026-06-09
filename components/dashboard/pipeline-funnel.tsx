"use client";

import Link from "next/link";
import { PIPELINE_STAGES } from "@/lib/constants";

interface PipelineFunnelProps {
  stageCounts: Record<string, number>;
}

export function PipelineFunnel({ stageCounts }: PipelineFunnelProps) {
  const stages = PIPELINE_STAGES.filter((s) => !["LOST"].includes(s.key));
  const maxCount = Math.max(...stages.map((s) => stageCounts[s.key] ?? 0), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Sales Pipeline</h3>
      <div className="space-y-2">
        {stages.map((stage, idx) => {
          const count = stageCounts[stage.key] ?? 0;
          const width = Math.max((count / maxCount) * 100, count > 0 ? 8 : 0);
          return (
            <Link
              key={stage.key}
              href={`/prospects?stage=${stage.key}`}
              className="group flex items-center gap-3"
            >
              <div className="w-28 text-xs text-slate-500 font-medium text-right shrink-0">
                {stage.label}
              </div>
              <div className="flex-1 h-7 bg-slate-100 rounded-md overflow-hidden">
                <div
                  className={`h-full ${stage.color} rounded-md transition-all duration-500 flex items-center justify-end pr-2`}
                  style={{ width: `${width}%`, minWidth: count > 0 ? "2rem" : "0" }}
                >
                  {count > 0 && (
                    <span className="text-xs font-bold text-white">{count}</span>
                  )}
                </div>
              </div>
              <div className="w-6 text-xs text-slate-600 font-semibold shrink-0">{count}</div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Won: {stageCounts.WON ?? 0}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          Lost: {stageCounts.LOST ?? 0}
        </div>
        {(stageCounts.WON ?? 0) + (stageCounts.LOST ?? 0) > 0 && (
          <div className="text-xs font-semibold text-emerald-600 ml-auto">
            Win Rate:{" "}
            {Math.round(
              ((stageCounts.WON ?? 0) /
                ((stageCounts.WON ?? 0) + (stageCounts.LOST ?? 0))) *
                100
            )}
            %
          </div>
        )}
      </div>
    </div>
  );
}
