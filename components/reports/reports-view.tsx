"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { getStageLabel, getSourceLabel, getActivityLabel } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/lib/constants";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

interface ReportsData {
  stageBreakdown: Array<{ stage: string; count: number }>;
  sourceBreakdown: Array<{ source: string; count: number }>;
  monthlyLeads: Array<{ month: string; count: number }>;
  activitiesByType: Array<{ type: string; count: number }>;
  wonCount: number;
  totalProspects: number;
}

export function ReportsView({ data }: { data: ReportsData }) {
  const stageData = PIPELINE_STAGES.map((s) => ({
    name: s.label,
    value: data.stageBreakdown.find((d) => d.stage === s.key)?.count ?? 0,
  }));

  const sourceData = data.sourceBreakdown.map((s) => ({
    name: getSourceLabel(s.source),
    value: s.count,
  }));

  const activityData = data.activitiesByType.slice(0, 8).map((a) => ({
    name: getActivityLabel(a.type).replace(" ", "\n"),
    value: a.count,
  }));

  const wonLostData = [
    { name: "Won", value: data.stageBreakdown.find((s) => s.stage === "WON")?.count ?? 0 },
    { name: "Lost", value: data.stageBreakdown.find((s) => s.stage === "LOST")?.count ?? 0 },
    { name: "Active", value: data.totalProspects - (data.stageBreakdown.find((s) => s.stage === "WON")?.count ?? 0) - (data.stageBreakdown.find((s) => s.stage === "LOST")?.count ?? 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Prospects", value: data.totalProspects, color: "text-indigo-600" },
          { label: "Won Deals", value: data.stageBreakdown.find((s) => s.stage === "WON")?.count ?? 0, color: "text-emerald-600" },
          { label: "Lost Deals", value: data.stageBreakdown.find((s) => s.stage === "LOST")?.count ?? 0, color: "text-red-600" },
          {
            label: "Win Rate",
            value: `${Math.round(((data.stageBreakdown.find((s) => s.stage === "WON")?.count ?? 0) / Math.max(data.totalProspects, 1)) * 100)}%`,
            color: "text-amber-600"
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Prospects by Stage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stageData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Leads by Source</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name ?? ""} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {sourceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">No source data yet</div>
          )}
        </div>

        {/* Monthly Leads */}
        {data.monthlyLeads.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Lead Volume</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthlyLeads} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Activity by Type */}
        {activityData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Volume by Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
