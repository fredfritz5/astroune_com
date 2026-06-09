"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertIntelligenceLog, addQuote } from "@/app/actions/modules";
import { formatDate } from "@/lib/utils";
import { Plus, Quote, Brain } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const fields = [
  { key: "whatsappProcess", label: "WhatsApp Ordering Process" },
  { key: "mpesaProcess", label: "M-Pesa Reconciliation Process" },
  { key: "loyaltySystem", label: "Loyalty / Rewards System" },
  { key: "desiredAutomations", label: "Desired Automations" },
  { key: "futureOpportunities", label: "Future Product Opportunities" },
] as const;

export function IntelligenceTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const log = prospect.intelligenceLog;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await upsertIntelligenceLog(formData);
        toast.success("Intelligence log updated");
        setIsEditing(false);
        router.refresh();
      } catch { toast.error("Failed to save"); }
    });
  }

  function handleAddQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!log) return;
    const formData = new FormData(e.currentTarget);
    formData.set("intelligenceLogId", log.id);
    startTransition(async () => {
      try {
        await addQuote(formData);
        toast.success("Quote saved");
        setShowQuoteForm(false);
        router.refresh();
      } catch { toast.error("Failed to add quote"); }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-500" />
          Restaurant Intelligence Log
        </h4>
        <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800">
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-slate-700 mb-1">{field.label}</label>
              <textarea
                name={field.key}
                defaultValue={log?.[field.key] ?? ""}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Describe ${field.label.toLowerCase()}…`}
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Digital Maturity (1–5)</label>
              <select name="digitalMaturity" defaultValue={log?.digitalMaturity ?? ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select...</option>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Automation Appetite (1–5)</label>
              <select name="automationAppetite" defaultValue={log?.automationAppetite ?? ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select...</option>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            Save Intelligence
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="bg-slate-50 rounded-lg p-3 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setIsEditing(true)}>
              <p className="text-xs font-semibold text-slate-500 mb-1">{field.label}</p>
              {log?.[field.key] ? (
                <p className="text-sm text-slate-800">{log[field.key]}</p>
              ) : (
                <p className="text-xs text-slate-400 italic">Click to add…</p>
              )}
            </div>
          ))}
          {log && (
            <div className="flex items-center gap-4">
              {log.digitalMaturity && (
                <div className="bg-slate-50 rounded-lg p-3 flex-1 text-center">
                  <p className="text-xs text-slate-500">Digital Maturity</p>
                  <p className="text-2xl font-bold text-slate-800">{log.digitalMaturity}/5</p>
                </div>
              )}
              {log.automationAppetite && (
                <div className="bg-indigo-50 rounded-lg p-3 flex-1 text-center">
                  <p className="text-xs text-indigo-500">Automation Appetite</p>
                  <p className="text-2xl font-bold text-indigo-800">{log.automationAppetite}/5</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Owner Quotes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Quote className="w-4 h-4 text-slate-400" />
            Owner Quotes
          </h5>
          {log && (
            <button onClick={() => setShowQuoteForm(!showQuoteForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Quote
            </button>
          )}
        </div>

        {showQuoteForm && log && (
          <form onSubmit={handleAddQuote} className="bg-slate-50 rounded-lg p-4 space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quote <span className="text-red-500">*</span></label>
              <textarea name="quote" required rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="What did the owner say, verbatim?" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Context</label>
              <input type="text" name="context" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="When/what were you discussing?" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save Quote</button>
              <button type="button" onClick={() => setShowQuoteForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
            </div>
          </form>
        )}

        {!log ? (
          <p className="text-xs text-slate-400 italic">Save the intelligence log first to add quotes</p>
        ) : log.quotes.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No quotes yet</p>
        ) : (
          <div className="space-y-3">
            {log.quotes.map((quote) => (
              <div key={quote.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-slate-800 italic">"{quote.quote}"</p>
                <div className="flex items-center gap-3 mt-2">
                  {quote.context && <p className="text-xs text-slate-500">{quote.context}</p>}
                  <p className="text-xs text-slate-400 ml-auto">{formatDate(quote.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
