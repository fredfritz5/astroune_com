import Link from "next/link";
import { getActivityLabel, formatRelative, getInitials } from "@/lib/utils";

interface Activity {
  id: string;
  type: string;
  date: Date;
  notes: string | null;
  prospect: { id: string; restaurantName: string } | null;
  user: { name: string | null; image: string | null } | null;
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <p className="text-sm text-slate-400 text-center py-8">No activities yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 flex-shrink-0 mt-0.5">
              {activity.user?.name ? getInitials(activity.user.name) : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-700">
                  {getActivityLabel(activity.type)}
                </span>
                {activity.prospect && (
                  <>
                    <span className="text-xs text-slate-400">with</span>
                    <Link
                      href={`/prospects/${activity.prospect.id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 truncate max-w-[120px]"
                    >
                      {activity.prospect.restaurantName}
                    </Link>
                  </>
                )}
              </div>
              {activity.notes && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.notes}</p>
              )}
              <p className="text-xs text-slate-400 mt-0.5">{formatRelative(activity.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
