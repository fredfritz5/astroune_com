import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { getActivityLabel, formatDateTime, getInitials } from "@/lib/utils";
import { Activity } from "lucide-react";

async function getActivities() {
  return prisma.activity.findMany({
    take: 100,
    include: {
      prospect: { select: { id: true, restaurantName: true, stage: true } },
      user: { select: { name: true, image: true } },
    },
    orderBy: { date: "desc" },
  });
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="flex flex-col h-full">
      <Header title="Activities" subtitle="All sales activities across your pipeline" />
      <div className="flex-1 p-6 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No activities logged yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Restaurant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Notes</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                        {getActivityLabel(activity.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {activity.prospect && (
                        <Link href={`/prospects/${activity.prospect.id}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                          {activity.prospect.restaurantName}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-slate-500 truncate max-w-xs">{activity.notes ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">{formatDateTime(activity.date)}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {activity.user?.name && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {getInitials(activity.user.name)}
                          </div>
                          <span className="text-xs text-slate-600">{activity.user.name}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
