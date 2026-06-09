"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProspectStage, deleteProspect } from "@/app/actions/prospects";
import {
  formatDate, getStageColor, getStageLabel, getSourceLabel,
  formatCurrency, getInitials, formatRelative
} from "@/lib/utils";
import { PIPELINE_STAGES } from "@/lib/constants";
import {
  Phone, MessageCircle, Mail, AtSign, Link2,
  MapPin, Edit, TrendingUp, Calendar, Building2, Trash2
} from "lucide-react";
import { toast } from "sonner";

interface ProspectHeaderProps {
  prospect: {
    id: string;
    restaurantName: string;
    branchName: string | null;
    location: string | null;
    area: string | null;
    contactPerson: string | null;
    position: string | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    instagram: string | null;
    linkedin: string | null;
    source: string | null;
    stage: string;
    priorityScore: number | null;
    numberOfBranches: number | null;
    currentPosStatus: string | null;
    existingSystem: string | null;
    estimatedDailyOrders: number | null;
    estimatedRevenue: number | null;
    automationAppetite: number | null;
    createdAt: Date;
    updatedAt: Date;
    leadOwner: { id: string; name: string | null; email: string; image: string | null } | null;
    activities: Array<{ date: Date }>;
    followUps: Array<{ dueDate: Date; status: string; type: string }>;
  };
}

export function ProspectProfileHeader({ prospect }: ProspectHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const lastActivity = prospect.activities[0];
  const nextFollowUp = prospect.followUps.find((f) => f.status === "PENDING");

  function handleStageChange(stage: string) {
    startTransition(async () => {
      try {
        await updateProspectStage({ prospectId: prospect.id, stage });
        toast.success(`Stage updated to ${getStageLabel(stage)}`);
        router.refresh();
      } catch {
        toast.error("Failed to update stage");
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Left: Identity */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 flex-shrink-0">
            {getInitials(prospect.restaurantName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{prospect.restaurantName}</h2>
              {prospect.branchName && (
                <span className="text-sm text-slate-400">({prospect.branchName})</span>
              )}
            </div>
            {(prospect.area || prospect.location) && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {[prospect.area, prospect.location].filter(Boolean).join(", ")}
              </div>
            )}
            {prospect.contactPerson && (
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div>
                  <p className="text-xs text-slate-400">Contact</p>
                  <p className="text-sm font-medium text-slate-800">{prospect.contactPerson}</p>
                  {prospect.position && <p className="text-xs text-slate-500">{prospect.position}</p>}
                </div>
              </div>
            )}
            {/* Contact Actions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {prospect.phone && (
                <a href={`tel:${prospect.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {prospect.phone}
                </a>
              )}
              {prospect.whatsapp && (
                <a href={`https://wa.me/${prospect.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-xs font-medium text-emerald-700 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
              {prospect.email && (
                <a href={`mailto:${prospect.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </a>
              )}
              {prospect.instagram && (
                <a href={`https://instagram.com/${prospect.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 hover:bg-pink-200 rounded-lg text-xs font-medium text-pink-700 transition-colors">
                  <AtSign className="w-3.5 h-3.5" /> Instagram
                </a>
              )}
              {prospect.linkedin && (
                <a href={prospect.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-colors">
                  <Link2 className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              <Link
                href={`/prospects/${prospect.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>
              {confirmDelete ? (
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-xs text-red-600 font-medium">Remove?</span>
                  <button
                    onClick={() => startTransition(async () => {
                      try {
                        await deleteProspect(prospect.id);
                        toast.success("Prospect removed");
                        router.push("/prospects");
                      } catch { toast.error("Failed to remove prospect"); setConfirmDelete(false); }
                    })}
                    disabled={isPending}
                    className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isPending ? "…" : "Yes, remove"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-medium text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stage & Stats */}
        <div className="flex flex-col gap-4 lg:w-72 shrink-0">
          {/* Current Stage */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Pipeline Stage</p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-lg ${getStageColor(prospect.stage)}`}>
                {getStageLabel(prospect.stage)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {PIPELINE_STAGES.map((stage) => (
                <button
                  key={stage.key}
                  onClick={() => handleStageChange(stage.key)}
                  disabled={isPending || stage.key === prospect.stage}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    stage.key === prospect.stage
                      ? `${stage.color} text-white cursor-default`
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Branches</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{prospect.numberOfBranches ?? "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Daily Orders</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{prospect.estimatedDailyOrders ?? "—"}</p>
            </div>
            {prospect.estimatedRevenue && (
              <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-slate-500">Est. Monthly Revenue</span>
                </div>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(prospect.estimatedRevenue)}</p>
              </div>
            )}
          </div>

          {/* Timeline Snapshot */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Added {formatDate(prospect.createdAt)}</span>
            </div>
            {lastActivity && (
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last activity {formatRelative(lastActivity.date)}</span>
              </div>
            )}
            {nextFollowUp && (
              <div className="flex items-center gap-2 text-amber-600 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Follow-up: {formatDate(nextFollowUp.dueDate)}</span>
              </div>
            )}
            {prospect.source && (
              <div className="flex items-center gap-2 text-slate-500">
                <span>Source: {getSourceLabel(prospect.source)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
