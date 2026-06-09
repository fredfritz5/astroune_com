"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProposal, updateProposalStatus } from "@/app/actions/modules";
import { PROPOSAL_PACKAGES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import type { ProspectData } from "./profile-tabs";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SENT: "bg-blue-100 text-blue-700",
  VIEWED: "bg-violet-100 text-violet-700",
  NEGOTIATING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

export function ProposalsTab({ prospect }: { prospect: ProspectData }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("prospectId", prospect.id);
    startTransition(async () => {
      try {
        await createProposal(formData);
        toast.success("Proposal recorded");
        setShowForm(false);
        router.refresh();
      } catch { toast.error("Failed to save"); }
    });
  }

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateProposalStatus(id, status, prospect.id);
        toast.success("Status updated");
        router.refresh();
      } catch { toast.error("Failed to update"); }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">Proposals ({prospect.proposals.length})</h4>
        <button onClick={() => setShowForm(!showForm)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add Proposal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Proposal Date <span className="text-red-500">*</span></label>
              <input type="date" name="proposalDate" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
              <input type="date" name="expiryDate" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Recommended Package</label>
            <select name="recommendedPkg" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select package...</option>
              {PROPOSAL_PACKAGES.map((pkg) => <option key={pkg} value={pkg}>{pkg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Value (KES)</label>
            <input type="number" name="value" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
            <select name="status" defaultValue="DRAFT" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
          </div>
        </form>
      )}

      {prospect.proposals.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No proposals yet</p>
      ) : (
        <div className="space-y-3">
          {prospect.proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">
                        {proposal.recommendedPkg ?? "Proposal"}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[proposal.status]}`}>
                        {proposal.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span>Sent: {formatDate(proposal.proposalDate)}</span>
                      {proposal.value && <span className="font-semibold text-slate-700">{formatCurrency(proposal.value)}</span>}
                      {proposal.expiryDate && <span>Expires: {formatDate(proposal.expiryDate)}</span>}
                    </div>
                    {proposal.notes && <p className="text-xs text-slate-500 mt-1">{proposal.notes}</p>}
                  </div>
                </div>
                <select
                  value={proposal.status}
                  onChange={(e) => handleStatusChange(proposal.id, e.target.value)}
                  disabled={isPending}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="VIEWED">Viewed</option>
                  <option value="NEGOTIATING">Negotiating</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
