"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertDiscoveryAnswer } from "@/app/actions/modules";
import { DISCOVERY_CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

export function DiscoveryTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    prospect.discoveryAnswers.forEach((a) => {
      map[`${a.category}|${a.question}`] = a.answer ?? "";
    });
    return map;
  });

  function handleSave(category: string, question: string) {
    const formData = new FormData();
    formData.set("prospectId", prospect.id);
    formData.set("category", category);
    formData.set("question", question);
    formData.set("answer", answers[`${category}|${question}`] ?? "");

    startTransition(async () => {
      try {
        await upsertDiscoveryAnswer(formData);
        toast.success("Answer saved");
        setEditingId(null);
        router.refresh();
      } catch { toast.error("Failed to save answer"); }
    });
  }

  return (
    <div className="space-y-6">
      {DISCOVERY_CATEGORIES.map((cat) => (
        <div key={cat.key}>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
              {cat.label[0]}
            </span>
            {cat.label}
          </h4>
          <div className="space-y-3">
            {cat.questions.map((question) => {
              const key = `${cat.key}|${question}`;
              const isEditing = editingId === key;
              const answer = answers[key] ?? "";

              return (
                <div key={question} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-700 mb-1.5">{question}</p>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        placeholder="Enter the owner's response..."
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleSave(cat.key, question)} disabled={isPending} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingId(key)}
                      className="cursor-pointer group"
                    >
                      {answer ? (
                        <p className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">{answer}</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic group-hover:text-indigo-500 transition-colors">Click to add answer…</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
