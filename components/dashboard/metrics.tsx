import Link from "next/link";
import {
  Users, TrendingUp, CalendarCheck, Monitor, FileText,
  Handshake, Trophy, XCircle, Bell, AlertCircle, Sparkles,
} from "lucide-react";

interface MetricsData {
  stageCounts: Record<string, number>;
  overdueFU: number;
  dueTodayFU: number;
  newThisWeek: number;
  totalProspects: number;
  activePipeline: number;
}

const metrics = (data: MetricsData) => [
  {
    label: "Total Prospects",
    value: data.totalProspects,
    icon: Users,
    color: "text-slate-600",
    bg: "bg-slate-100",
    href: "/prospects",
  },
  {
    label: "Active Pipeline",
    value: data.activePipeline,
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    href: "/pipeline",
  },
  {
    label: "Discovery Done",
    value: data.stageCounts.DISCOVERY_DONE ?? 0,
    icon: CalendarCheck,
    color: "text-violet-600",
    bg: "bg-violet-100",
    href: "/prospects?stage=DISCOVERY_DONE",
  },
  {
    label: "Demos Scheduled",
    value: data.stageCounts.DEMO_DONE ?? 0,
    icon: Monitor,
    color: "text-amber-600",
    bg: "bg-amber-100",
    href: "/prospects?stage=DEMO_DONE",
  },
  {
    label: "Proposals Sent",
    value: data.stageCounts.PROPOSAL_SENT ?? 0,
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-100",
    href: "/prospects?stage=PROPOSAL_SENT",
  },
  {
    label: "Negotiating",
    value: data.stageCounts.NEGOTIATING ?? 0,
    icon: Handshake,
    color: "text-pink-600",
    bg: "bg-pink-100",
    href: "/prospects?stage=NEGOTIATING",
  },
  {
    label: "Won Deals",
    value: data.stageCounts.WON ?? 0,
    icon: Trophy,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    href: "/prospects?stage=WON",
  },
  {
    label: "Lost Deals",
    value: data.stageCounts.LOST ?? 0,
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    href: "/prospects?stage=LOST",
  },
  {
    label: "Overdue Follow-Ups",
    value: data.overdueFU,
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    href: "/follow-ups?filter=overdue",
    alert: data.overdueFU > 0,
  },
  {
    label: "Follow-Ups Today",
    value: data.dueTodayFU,
    icon: Bell,
    color: "text-amber-600",
    bg: "bg-amber-100",
    href: "/follow-ups?filter=today",
  },
  {
    label: "New Leads This Week",
    value: data.newThisWeek,
    icon: Sparkles,
    color: "text-blue-600",
    bg: "bg-blue-100",
    href: "/prospects",
  },
];

export function DashboardMetrics({ data }: { data: MetricsData }) {
  const items = metrics(data);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((metric) => {
        const Icon = metric.icon;
        return (
          <Link
            key={metric.label}
            href={metric.href}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${metric.bg} flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${metric.color}`} />
              </div>
              {(metric as { alert?: boolean }).alert && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 font-medium">{metric.label}</div>
          </Link>
        );
      })}
    </div>
  );
}
