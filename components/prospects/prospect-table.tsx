"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate, getStageColor, getStageLabel, getSourceLabel, getPriorityLabel, getInitials } from "@/lib/utils";
import { MapPin, Phone, Bell, Activity, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { deleteProspect } from "@/app/actions/prospects";
import { toast } from "sonner";

interface Prospect {
  id: string;
  restaurantName: string;
  branchName: string | null;
  location: string | null;
  area: string | null;
  contactPerson: string | null;
  position: string | null;
  phone: string | null;
  source: string | null;
  stage: string;
  priorityScore: number | null;
  createdAt: Date;
  updatedAt: Date;
  leadOwner: { name: string | null; image: string | null } | null;
  _count: { activities: number; followUps: number };
}

function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => startTransition(async () => {
            try {
              await deleteProspect(id);
              toast.success(`${name} removed`);
              router.refresh();
            } catch { toast.error("Failed to remove prospect"); setConfirm(false); }
          })}
          disabled={isPending}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "…" : "Yes"}
        </button>
        <button onClick={() => setConfirm(false)} className="px-2 py-1 text-xs bg-slate-200 text-slate-700 rounded font-medium hover:bg-slate-300">
          No
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirm(true)} className="text-slate-300 hover:text-red-500 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export function ProspectTable({ prospects }: { prospects: Prospect[] }) {
  if (prospects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <Activity className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No prospects found</p>
        <p className="text-xs text-slate-400 mt-1">Add your first prospect to get started</p>
        <Link
          href="/prospects/new"
          className="inline-flex items-center gap-2 mt-4 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Prospect
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Restaurant
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Contact
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              Area / Source
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stage
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              Activity
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
              Added
            </th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {prospects.map((prospect) => {
            const priority = getPriorityLabel(prospect.priorityScore);
            return (
              <tr key={prospect.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                      {getInitials(prospect.restaurantName)}
                    </div>
                    <div>
                      <Link
                        href={`/prospects/${prospect.id}`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {prospect.restaurantName}
                      </Link>
                      {prospect.branchName && (
                        <p className="text-xs text-slate-400">{prospect.branchName}</p>
                      )}
                      {prospect.priorityScore !== null && prospect.priorityScore > 0 && (
                        <p className={`text-xs ${priority.color} font-medium`}>{priority.label}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  {prospect.contactPerson ? (
                    <div>
                      <p className="font-medium text-slate-700">{prospect.contactPerson}</p>
                      {prospect.position && (
                        <p className="text-xs text-slate-400">{prospect.position}</p>
                      )}
                      {prospect.phone && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {prospect.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  {prospect.area && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {prospect.area}
                    </div>
                  )}
                  {prospect.source && (
                    <span className="inline-flex px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                      {getSourceLabel(prospect.source)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStageColor(prospect.stage)}`}>
                    {getStageLabel(prospect.stage)}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {prospect._count.activities}
                    </span>
                    {prospect._count.followUps > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Bell className="w-3 h-3" />
                        {prospect._count.followUps}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden xl:table-cell">
                  <span className="text-xs text-slate-400">{formatDate(prospect.createdAt)}</span>
                </td>
                <td className="px-2 py-3.5">
                  <div className="flex items-center gap-2">
                    <Link href={`/prospects/${prospect.id}`} className="text-slate-400 hover:text-indigo-600 transition-colors" title="View">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <Link href={`/prospects/${prospect.id}/edit`} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <DeleteButton id={prospect.id} name={prospect.restaurantName} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
