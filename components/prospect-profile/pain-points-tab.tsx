"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPainPoint } from "@/app/actions/modules";
import { PAIN_POINT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const severityColors = ["", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-amber-100 text-amber-700", "bg-orange-100 text-orange-700", "bg-red-100 text-red-700"];
const severityLabels = ["", "Mild", "Low", "Medium", "High", "Critical"];

export function PainPointsTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createPainPoint(formData);
        toast.success("Pain point recorded");
        setShowForm(false);
        router.refresh();
      } catch { toast.error("Failed to save"); }
    });
  }

  const grouped = PAIN_POINT_CATEGORIES.map((cat) => ({
    ...cat,
    points: prospect.painPoints.filter((p) => p.category === cat.key),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
          Pain Points ({prospect.painPoints.length})
        </h4>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Pain Point
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select name="category" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {PAIN_POINT_CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Severity (1–5)</label>
              <select name="severity" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="1">1 – Mild</option>
                <option value="2">2 – Low</option>
                <option value="3">3 – Medium</option>
                <option value="4">4 – High</option>
                <option value="5">5 – Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Frequency (1–5)</label>
              <select name="frequency" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="1">1 – Rarely</option>
                <option value="2">2 – Sometimes</option>
                <option value="3">3 – Often</option>
                <option value="4">4 – Very Often</option>
                <option value="5">5 – Constantly</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea name="description" required rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Describe the specific pain point..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Additional Notes</label>
            <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Context, quotes, etc." />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </form>
      )}

      {prospect.painPoints.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No pain points recorded yet</p>
      ) : (
        <div className="space-y-4">
          {grouped.filter((g) => g.points.length > 0).map((group) => (
            <div key={group.key}>
              <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{group.label}</h5>
              <div className="space-y-2">
                {group.points.map((point) => (
                  <div key={point.id} className="bg-white border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${point.severity >= 4 ? "text-red-500" : point.severity === 3 ? "text-amber-500" : "text-slate-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800">{point.description}</p>
                        {point.notes && <p className="text-xs text-slate-500 mt-1">{point.notes}</p>}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[point.severity]}`}>
                            Severity: {severityLabels[point.severity]}
                          </span>
                          <span className="text-xs text-slate-400">Frequency: {point.frequency}/5</span>
                          <span className="text-xs text-slate-400">{formatDate(point.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
