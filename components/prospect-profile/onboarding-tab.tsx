"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertOnboarding } from "@/app/actions/modules";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const steps = [
  { key: "agreementConfirmed", dateKey: "agreementDate", label: "Agreement Confirmed" },
  { key: "founderIntroduced", dateKey: "founderIntroDate", label: "Founder Introduced" },
  { key: "onboardingScheduled", dateKey: "onboardingScheduleDate", label: "Onboarding Scheduled" },
  { key: "setupStarted", dateKey: "setupStartDate", label: "Setup Started" },
  { key: "setupComplete", dateKey: "setupCompleteDate", label: "Setup Complete" },
  { key: "trainingComplete", dateKey: "trainingCompleteDate", label: "Training Complete" },
  { key: "goLive", dateKey: "goLiveDate", label: "Go Live" },
  { key: "thirtyDayReview", dateKey: "thirtyDayReviewDate", label: "30-Day Review" },
] as const;

export function OnboardingTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const onboarding = prospect.onboarding;
  const completedCount = onboarding
    ? steps.filter((s) => onboarding[s.key]).length
    : 0;
  const progress = Math.round((completedCount / steps.length) * 100);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    steps.forEach((step) => {
      const checkbox = (e.currentTarget.elements.namedItem(step.key) as HTMLInputElement);
      formData.set(step.key, String(checkbox?.checked ?? false));
    });
    startTransition(async () => {
      try {
        await upsertOnboarding(formData);
        toast.success("Onboarding updated");
        setIsEditing(false);
        router.refresh();
      } catch { toast.error("Failed to update onboarding"); }
    });
  }

  // Allow editing onboarding at any stage

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Onboarding Checklist</h4>
          <p className="text-xs text-slate-500 mt-0.5">{completedCount}/{steps.length} steps complete</p>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {steps.map((step) => {
            const checked = onboarding ? onboarding[step.key] : false;
            const dateVal = onboarding && onboarding[step.dateKey]
              ? new Date(onboarding[step.dateKey]!).toISOString().split("T")[0]
              : "";
            return (
              <div key={step.key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  name={step.key}
                  id={step.key}
                  defaultChecked={checked}
                  className="rounded w-4 h-4 accent-indigo-600"
                />
                <label htmlFor={step.key} className="text-sm font-medium text-slate-700 flex-1">
                  {step.label}
                </label>
                <input
                  type="date"
                  name={step.dateKey}
                  defaultValue={dateVal}
                  className="text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            );
          })}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <textarea name="notes" defaultValue={onboarding?.notes ?? ""} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            Save Onboarding
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          {steps.map((step) => {
            const done = onboarding ? onboarding[step.key] : false;
            const dateVal = onboarding && onboarding[step.dateKey];
            return (
              <div key={step.key} className={`flex items-center gap-3 p-3 rounded-lg ${done ? "bg-emerald-50" : "bg-slate-50"}`}>
                {done ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <span className={`text-sm font-medium flex-1 ${done ? "text-emerald-800" : "text-slate-500"}`}>
                  {step.label}
                </span>
                {dateVal && (
                  <span className="text-xs text-slate-400">{formatDate(dateVal)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
