"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProspect, updateProspect } from "@/app/actions/prospects";
import { LEAD_SOURCES, NAIROBI_AREAS } from "@/lib/constants";
import { toast } from "sonner";

interface ProspectFormProps {
  prospect?: {
    id: string;
    restaurantName: string;
    branchName?: string | null;
    location?: string | null;
    area?: string | null;
    contactPerson?: string | null;
    position?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    source?: string | null;
    numberOfBranches?: number | null;
    currentPosStatus?: string | null;
    existingSystem?: string | null;
    estimatedDailyOrders?: number | null;
    estimatedRevenue?: number | null;
    automationAppetite?: number | null;
    priorityScore?: number | null;
  };
}

export function ProspectForm({ prospect }: ProspectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!prospect;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProspect(prospect.id, formData);
          toast.success("Prospect updated successfully");
          router.push(`/prospects/${prospect.id}`);
        } else {
          const result = await createProspect(formData);
          toast.success("Prospect added successfully");
          router.push(`/prospects/${result.id}`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Restaurant Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Restaurant Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Restaurant Name <span className="text-red-500">*</span>
            </label>
            <input
              name="restaurantName"
              defaultValue={prospect?.restaurantName}
              required
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g. Mama Oliech Restaurant"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Branch Name</label>
            <input
              name="branchName"
              defaultValue={prospect?.branchName ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Main Branch, Westlands..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Number of Branches</label>
            <input
              name="numberOfBranches"
              type="number"
              min="1"
              defaultValue={prospect?.numberOfBranches ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
            <input
              name="location"
              defaultValue={prospect?.location ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Specific address or landmark"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Area</label>
            <select
              name="area"
              defaultValue={prospect?.area ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select area...</option>
              {NAIROBI_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Lead Source</label>
            <select
              name="source"
              defaultValue={prospect?.source ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select source...</option>
              {LEAD_SOURCES.map((source) => (
                <option key={source.key} value={source.key}>{source.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Contact Person</label>
            <input
              name="contactPerson"
              defaultValue={prospect?.contactPerson ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Position/Title</label>
            <input
              name="position"
              defaultValue={prospect?.position ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Owner, Manager..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
            <input
              name="phone"
              type="tel"
              defaultValue={prospect?.phone ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+254 7xx xxx xxx"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">WhatsApp Number</label>
            <input
              name="whatsapp"
              type="tel"
              defaultValue={prospect?.whatsapp ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+254 7xx xxx xxx"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={prospect?.email ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="contact@restaurant.co.ke"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Instagram</label>
            <input
              name="instagram"
              defaultValue={prospect?.instagram ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="@restaurant"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">LinkedIn</label>
            <input
              name="linkedin"
              defaultValue={prospect?.linkedin ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="linkedin.com/company/..."
            />
          </div>
        </div>
      </div>

      {/* Business Intelligence */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Business Intelligence</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Current POS Status</label>
            <select
              name="currentPosStatus"
              defaultValue={prospect?.currentPosStatus ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="No POS">No POS (Manual)</option>
              <option value="Basic POS">Basic POS</option>
              <option value="Old POS">Old/Outdated POS</option>
              <option value="Competitor POS">Competitor POS</option>
              <option value="Custom System">Custom System</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Existing System</label>
            <input
              name="existingSystem"
              defaultValue={prospect?.existingSystem ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="iKoze, Loyverse, custom..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Est. Daily Orders</label>
            <input
              name="estimatedDailyOrders"
              type="number"
              min="0"
              defaultValue={prospect?.estimatedDailyOrders ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Est. Monthly Revenue (KES)</label>
            <input
              name="estimatedRevenue"
              type="number"
              min="0"
              defaultValue={prospect?.estimatedRevenue ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Automation Appetite (1–5)
            </label>
            <select
              name="automationAppetite"
              defaultValue={prospect?.automationAppetite ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">Select...</option>
              <option value="1">1 – Very Low</option>
              <option value="2">2 – Low</option>
              <option value="3">3 – Medium</option>
              <option value="4">4 – High</option>
              <option value="5">5 – Very High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Priority Score (0–10)
            </label>
            <input
              name="priorityScore"
              type="number"
              min="0"
              max="10"
              defaultValue={prospect?.priorityScore ?? ""}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="7"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Prospect"}
        </button>
      </div>
    </form>
  );
}
