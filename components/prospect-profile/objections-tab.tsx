"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createObjection, resolveObjection } from "@/app/actions/modules";
import { OBJECTION_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Plus, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const statusColors: Record<string, string> = {
  OPEN: "bg-red-100 text-red-700",
  ADDRESSED: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

export function ObjectionsTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createObjection(formData);
        toast.success("Objection recorded");
        setShowForm(false);
        router.refresh();
      } catch { toast.error("Failed to save"); }
    });
  }

  function handleResolve(id: string) {
    startTransition(async () => {
      try {
        await resolveObjection(id, prospect.id);
        toast.success("Objection resolved");
        router.refresh();
      } catch { toast.error("Failed to resolve"); }
    });
  }

  const openObjections = prospect.objections.filter((o) => !o.resolved);
  const resolvedObjections = prospect.objections.filter((o) => o.resolved);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
          Objections ({openObjections.length} open, {resolvedObjections.length} resolved)
        </h4>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Objection
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
            <select name="category" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {OBJECTION_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Objection <span className="text-red-500">*</span></label>
            <input type="text" name="objection" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What did they say?" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Response Given</label>
            <textarea name="responseGiven" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="How did you respond?" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </form>
      )}

      {openObjections.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Objections</h5>
          {openObjections.map((obj) => (
            <div key={obj.id} className="bg-white border border-red-200 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{obj.objection}</p>
                    <span className="inline-flex px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full mt-1">
                      {OBJECTION_CATEGORIES.find((c) => c.key === obj.category)?.label ?? obj.category}
                    </span>
                    {obj.responseGiven && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-600 mb-0.5">Response Given</p>
                        <p className="text-xs text-blue-700">{obj.responseGiven}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => handleResolve(obj.id)} disabled={isPending} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 disabled:opacity-50 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" /> Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolvedObjections.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</h5>
          {resolvedObjections.map((obj) => (
            <div key={obj.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 opacity-70">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">{obj.objection}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(obj.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {prospect.objections.length === 0 && (
        <p className="text-xs text-slate-400 italic">No objections recorded yet</p>
      )}
    </div>
  );
}
