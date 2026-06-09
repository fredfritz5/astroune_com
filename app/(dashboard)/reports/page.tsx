import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { ReportsView } from "@/components/reports/reports-view";

async function getReportData() {
  const [
    stageBreakdown,
    sourceBreakdown,
    monthlyLeads,
    activitiesByType,
    wonLostRatio,
  ] = await Promise.all([
    prisma.prospect.groupBy({
      by: ["stage"],
      where: { isActive: true },
      _count: { stage: true },
    }),
    prisma.prospect.groupBy({
      by: ["source"],
      where: { isActive: true, source: { not: null } },
      _count: { source: true },
    }),
    // Monthly leads for last 6 months
    prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count
      FROM "Prospect"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
    prisma.activity.groupBy({
      by: ["type"],
      _count: { type: true },
      orderBy: { _count: { type: "desc" } },
    }),
    prisma.prospect.count({ where: { stage: "WON" } }),
  ]);

  return {
    stageBreakdown: stageBreakdown.map((s) => ({ stage: s.stage, count: s._count.stage })),
    sourceBreakdown: sourceBreakdown.map((s) => ({ source: s.source ?? "Unknown", count: s._count.source })),
    monthlyLeads: monthlyLeads.map((m) => ({ month: m.month, count: Number(m.count) })),
    activitiesByType: activitiesByType.map((a) => ({ type: a.type, count: a._count.type })),
    wonCount: wonLostRatio,
    totalProspects: stageBreakdown.reduce((a, s) => a + s._count.stage, 0),
  };
}

export default async function ReportsPage() {
  const data = await getReportData();

  return (
    <div className="flex flex-col h-full">
      <Header title="Reports & Analytics" subtitle="Sales performance insights" />
      <div className="flex-1 p-6 overflow-y-auto">
        <ReportsView data={data} />
      </div>
    </div>
  );
}
