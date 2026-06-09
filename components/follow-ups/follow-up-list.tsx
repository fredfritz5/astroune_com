"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeFollowUp } from "@/app/actions/followups";
import { formatDate, getDueDateLabel, getStageColor, getStageLabel } from "@/lib/utils";
import { CheckCircle, AlertCircle, Bell, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface FollowUp {
  id: string;
  type: string;
  dueDate: Date;
  notes: string | null;
  status: string;
  prospect: { id: string; restaurantName: string; stage: string; area: string | null } | null;
  user: { name: string | null; image: string | null } | null;
}

interface FollowUpListProps {
  followUps: FollowUp[];
  activeFilter: string;
  overdueCnt: number;
  todayCnt: number;
  upcomingCnt: number;
}

const filters = [
  { key: "all", label: "All Pending" },
  { key: "overdue", label: "Overdue", alertColor: "text-red-600 bg-red-50 border-red-200" },
  { key: "today", label: "Today", alertColor: "text-amber-600 bg-amber-50 border-amber-200" },
  { key: "upcoming", label: "Next 7 Days" },
];

export function FollowUpList({ followUps, activeFilter, overdueCnt, todayCnt, upcomingCnt }: FollowUpListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleComplete(id: string) {
    startTransition(async () => {
      try {
        await completeFollowUp(id);
        toast.success("Follow-up completed!");
        router.refresh();
      } catch { toast.error("Failed to complete"); }
    });
  }

  const counts: Record<string, number> = { overdue: overdueCnt, today: todayCnt, upcoming: upcomingCnt };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/follow-ups" : `/follow-ups?filter=${f.key}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f.key || (f.key === "all" && !activeFilter)
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {f.label}
            {counts[f.key] !== undefined && counts[f.key] > 0 && (
              <span className={`text-xs font-bold ${activeFilter === f.key ? "text-white" : "text-red-600"}`}>
                {counts[f.key]}
              </span>
            )}
          </Link>
        ))}
      </div>

      {followUps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No {activeFilter !== "all" ? activeFilter : "pending"} follow-ups</p>
        </div>
      ) : (
        <div className="space-y-2">
          {followUps.map((fu) => {
            const dueDateLabel = getDueDateLabel(fu.dueDate);
            const isOverdue = dueDateLabel === "Overdue";

            return (
              <div
                key={fu.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${
                  isOverdue ? "border-red-200" : "border-slate-200"
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                ) : (
                  <Bell className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isOverdue ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {dueDateLabel}
                    </span>
                    <span className="text-xs text-slate-500">{fu.type.replace(/_/g, " ")}</span>
                  </div>
                  {fu.prospect && (
                    <Link href={`/prospects/${fu.prospect.id}`} className="flex items-center gap-2 mt-1 group">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {fu.prospect.restaurantName}
                      </p>
                      {fu.prospect.area && <span className="text-xs text-slate-400">{fu.prospect.area}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(fu.prospect.stage)}`}>
                        {getStageLabel(fu.prospect.stage)}
                      </span>
                    </Link>
                  )}
                  {fu.notes && <p className="text-xs text-slate-500 mt-0.5 truncate">{fu.notes}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{formatDate(fu.dueDate)}</span>
                  <button
                    onClick={() => handleComplete(fu.id)}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Done
                  </button>
                  {fu.prospect && (
                    <Link
                      href={`/prospects/${fu.prospect.id}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
