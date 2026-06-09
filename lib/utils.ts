import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, fmt = "MMM d, yyyy") {
  return format(new Date(date), fmt);
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getDueDateLabel(date: Date | string) {
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) return "Overdue";
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return formatDate(d, "MMM d");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function getPriorityLabel(score: number | null | undefined) {
  if (!score) return { label: "No Priority", color: "text-slate-400" };
  if (score >= 8) return { label: "High Priority", color: "text-red-600" };
  if (score >= 5) return { label: "Medium Priority", color: "text-amber-600" };
  return { label: "Low Priority", color: "text-slate-500" };
}

export function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    PROSPECT: "bg-slate-100 text-slate-700",
    CONTACTED: "bg-blue-100 text-blue-700",
    DISCOVERY_DONE: "bg-violet-100 text-violet-700",
    DEMO_DONE: "bg-amber-100 text-amber-700",
    PROPOSAL_SENT: "bg-orange-100 text-orange-700",
    NEGOTIATING: "bg-pink-100 text-pink-700",
    WON: "bg-emerald-100 text-emerald-700",
    LOST: "bg-red-100 text-red-700",
  };
  return colors[stage] ?? "bg-slate-100 text-slate-700";
}

export function getStageDotColor(stage: string) {
  const colors: Record<string, string> = {
    PROSPECT: "bg-slate-500",
    CONTACTED: "bg-blue-500",
    DISCOVERY_DONE: "bg-violet-500",
    DEMO_DONE: "bg-amber-500",
    PROPOSAL_SENT: "bg-orange-500",
    NEGOTIATING: "bg-pink-500",
    WON: "bg-emerald-500",
    LOST: "bg-red-500",
  };
  return colors[stage] ?? "bg-slate-500";
}

export function getStageLabel(stage: string) {
  const labels: Record<string, string> = {
    PROSPECT: "Prospect",
    CONTACTED: "Contacted",
    DISCOVERY_DONE: "Discovery Done",
    DEMO_DONE: "Demo Done",
    PROPOSAL_SENT: "Proposal Sent",
    NEGOTIATING: "Negotiating",
    WON: "Won",
    LOST: "Lost",
  };
  return labels[stage] ?? stage;
}

export function getSourceLabel(source: string | null | undefined) {
  if (!source) return "Unknown";
  const labels: Record<string, string> = {
    WALK_IN: "Walk-in",
    GOOGLE_MAPS: "Google Maps",
    INSTAGRAM: "Instagram",
    LINKEDIN: "LinkedIn",
    REFERRAL: "Referral",
    GLOVO: "Glovo",
    UBER_EATS: "Uber Eats",
    JUMIA_FOOD: "Jumia Food",
    OTHER: "Other",
  };
  return labels[source] ?? source;
}

export function getActivityLabel(type: string) {
  const labels: Record<string, string> = {
    WALK_IN_VISIT: "Walk-in Visit",
    PHONE_CALL: "Phone Call",
    WHATSAPP_MESSAGE: "WhatsApp Message",
    LINKEDIN_MESSAGE: "LinkedIn Message",
    EMAIL: "Email",
    DISCOVERY_MEETING: "Discovery Meeting",
    DEMO: "Demo",
    PROPOSAL_SENT: "Proposal Sent",
    NEGOTIATION_MEETING: "Negotiation Meeting",
    FOLLOW_UP: "Follow-Up",
    ONBOARDING_MEETING: "Onboarding Meeting",
    OTHER: "Other",
  };
  return labels[type] ?? type;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
