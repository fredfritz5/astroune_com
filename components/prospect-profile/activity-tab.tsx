"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createActivity } from "@/app/actions/activities";
import { createFollowUp, completeFollowUp } from "@/app/actions/followups";
import { formatDateTime, getActivityLabel, formatDate, getDueDateLabel, getInitials } from "@/lib/utils";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { Plus, CheckCircle, Clock, Bell, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

export function ActivityTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pendingFollowUps = prospect.followUps.filter((f) => f.status === "PENDING");
  const completedFollowUps = prospect.followUps.filter((f) => f.status === "COMPLETED");

  function handleLogActivity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createActivity(formData);
        toast.success("Activity logged");
        setShowActivityForm(false);
        router.refresh();
      } catch { toast.error("Failed to log activity"); }
    });
  }

  function handleCreateFollowUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createFollowUp(formData);
        toast.success("Follow-up scheduled");
        setShowFollowUpForm(false);
        router.refresh();
      } catch { toast.error("Failed to schedule follow-up"); }
    });
  }

  function handleComplete(id: string) {
    startTransition(async () => {
      try {
        await completeFollowUp(id);
        toast.success("Follow-up completed");
        router.refresh();
      } catch { toast.error("Failed to complete follow-up"); }
    });
  }

  return (
    <div className="space-y-6">
      {/* Follow-ups Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-900">Follow-Ups</h4>
          <button onClick={() => setShowFollowUpForm(!showFollowUpForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Schedule
          </button>
        </div>

        {showFollowUpForm && (
          <form onSubmit={handleCreateFollowUp} className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                <select name="type" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="CALL">Call</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                  <option value="MEETING">Meeting</option>
                  <option value="DEMO">Demo</option>
                  <option value="PROPOSAL_FOLLOW_UP">Proposal Follow-Up</option>
                  <option value="CHECK_IN">Check-in</option>
                  <option value="RE_ENGAGEMENT">Re-engagement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" name="dueDate" required min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
              <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What should happen in this follow-up?" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                Schedule
              </button>
              <button type="button" onClick={() => setShowFollowUpForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        {pendingFollowUps.length === 0 && !showFollowUpForm ? (
          <p className="text-xs text-slate-400 italic">No pending follow-ups</p>
        ) : (
          <div className="space-y-2">
            {pendingFollowUps.map((fu) => {
              const dueDateLabel = getDueDateLabel(fu.dueDate);
              const isOverdue = dueDateLabel === "Overdue";
              return (
                <div key={fu.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isOverdue ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                  {isOverdue ? (
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${isOverdue ? "text-red-700" : "text-amber-700"}`}>
                      {fu.type.replace(/_/g, " ")} — {dueDateLabel}
                    </p>
                    {fu.notes && <p className="text-xs text-slate-500 truncate">{fu.notes}</p>}
                  </div>
                  <button onClick={() => handleComplete(fu.id)} disabled={isPending} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 disabled:opacity-50">
                    <CheckCircle className="w-3.5 h-3.5" /> Done
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-slate-900">Activity Timeline</h4>
          <button onClick={() => setShowActivityForm(!showActivityForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Log Activity
          </button>
        </div>

        {showActivityForm && (
          <form onSubmit={handleLogActivity} className="bg-slate-50 rounded-lg p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Activity Type</label>
                <select name="type" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time</label>
                <input type="datetime-local" name="date" required defaultValue={new Date().toISOString().slice(0, 16)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
              <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What happened?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Outcome</label>
              <textarea name="outcome" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What was the result?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Next Action</label>
              <input type="text" name="nextAction" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="What needs to happen next?" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                Log Activity
              </button>
              <button type="button" onClick={() => setShowActivityForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">
                Cancel
              </button>
            </div>
          </form>
        )}

        {prospect.activities.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No activities yet. Log the first one!</p>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-200" />
            <div className="space-y-4">
              {prospect.activities.map((activity) => (
                <div key={activity.id} className="relative flex gap-4 pl-10">
                  <div className="absolute left-0 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-600 z-10 top-0">
                    {activity.user?.name ? getInitials(activity.user.name) : "?"}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-800">
                        {getActivityLabel(activity.type)}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">{formatDateTime(activity.date)}</span>
                    </div>
                    {activity.notes && <p className="text-xs text-slate-600 mb-1">{activity.notes}</p>}
                    {activity.outcome && (
                      <div className="mt-1.5">
                        <span className="text-xs text-slate-400">Outcome: </span>
                        <span className="text-xs text-slate-600">{activity.outcome}</span>
                      </div>
                    )}
                    {activity.nextAction && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span className="text-xs text-indigo-600">{activity.nextAction}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
