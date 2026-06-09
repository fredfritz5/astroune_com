import Link from "next/link";
import { AlertCircle, Bell, ArrowRight } from "lucide-react";

interface FollowUpWidgetProps {
  overdue: number;
  dueToday: number;
}

export function FollowUpWidget({ overdue, dueToday }: FollowUpWidgetProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Follow-Up Status</h3>
      <div className="space-y-3">
        <Link
          href="/follow-ups?filter=overdue"
          className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100 hover:border-red-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-semibold text-red-700">{overdue} Overdue</div>
              <div className="text-xs text-red-500">Need immediate attention</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-red-400" />
        </Link>

        <Link
          href="/follow-ups?filter=today"
          className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100 hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-sm font-semibold text-amber-700">{dueToday} Due Today</div>
              <div className="text-xs text-amber-500">Complete before end of day</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>

        <Link
          href="/follow-ups"
          className="flex items-center justify-center gap-2 p-2 text-xs text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
        >
          View all follow-ups
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
