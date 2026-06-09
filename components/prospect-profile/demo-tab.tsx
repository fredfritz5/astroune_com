"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDemo } from "@/app/actions/modules";
import { formatDate } from "@/lib/utils";
import { Plus, Star, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

export function DemoTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    const founderPresent = (e.currentTarget.elements.namedItem("founderPresent") as HTMLInputElement).checked;
    formData.set("founderPresent", String(founderPresent));
    startTransition(async () => {
      try {
        await createDemo(formData);
        toast.success("Demo recorded");
        setShowForm(false);
        router.refresh();
      } catch { toast.error("Failed to save demo"); }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Demo History ({prospect.demos.length})</h4>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Log Demo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Demo Date <span className="text-red-500">*</span></label>
              <input type="datetime-local" name="demoDate" required defaultValue={new Date().toISOString().slice(0, 16)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rating (1–5)</label>
              <select name="rating" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select rating...</option>
                <option value="1">1 – Poor</option>
                <option value="2">2 – Below Average</option>
                <option value="3">3 – Good</option>
                <option value="4">4 – Very Good</option>
                <option value="5">5 – Excellent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Attendees</label>
            <input type="text" name="attendees" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Who attended?" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="founderPresent" id="founderPresent" className="rounded" />
            <label htmlFor="founderPresent" className="text-xs font-medium text-slate-700">Founder/Owner was present</label>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Features Demonstrated</label>
            <textarea name="featuresDemo" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Which features were shown?" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Prospect Feedback</label>
            <textarea name="prospectFeedback" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="How did they react?" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Objections Raised</label>
            <textarea name="objectionsRaised" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="Any concerns they raised?" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save Demo</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </form>
      )}

      {prospect.demos.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No demos recorded yet</p>
      ) : (
        <div className="space-y-3">
          {prospect.demos.map((demo) => (
            <div key={demo.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{formatDate(demo.demoDate, "MMMM d, yyyy 'at' h:mm a")}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {demo.founderPresent && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Founder Present
                      </span>
                    )}
                    {demo.attendees && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="w-3.5 h-3.5" /> {demo.attendees}
                      </span>
                    )}
                  </div>
                </div>
                {demo.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < demo.rating! ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                    ))}
                  </div>
                )}
              </div>
              {demo.featuresDemo && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Features Shown</p>
                  <p className="text-sm text-slate-700">{demo.featuresDemo}</p>
                </div>
              )}
              {demo.prospectFeedback && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-slate-500 mb-0.5">Feedback</p>
                  <p className="text-sm text-slate-700">{demo.prospectFeedback}</p>
                </div>
              )}
              {demo.objectionsRaised && (
                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                  <p className="text-xs font-medium text-red-600 mb-0.5">Objections Raised</p>
                  <p className="text-sm text-red-700">{demo.objectionsRaised}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
