import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { PipelineFunnel } from "@/components/dashboard/pipeline-funnel";
import { FollowUpWidget } from "@/components/dashboard/follow-up-widget";
import { RecentActivity } from "@/components/dashboard/recent-activity";

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    stageBreakdown,
    overdueFU,
    dueTodayFU,
    newThisWeek,
    recentActivities,
  ] = await Promise.all([
    prisma.prospect.groupBy({
      by: ["stage"],
      where: { isActive: true },
      _count: { stage: true },
    }),
    prisma.followUp.count({
      where: { status: "PENDING", dueDate: { lt: today } },
    }),
    prisma.followUp.count({
      where: { status: "PENDING", dueDate: { gte: today, lt: tomorrow } },
    }),
    prisma.prospect.count({
      where: { isActive: true, createdAt: { gte: weekAgo } },
    }),
    prisma.activity.findMany({
      take: 10,
      include: {
        prospect: { select: { id: true, restaurantName: true } },
        user: { select: { name: true, image: true } },
      },
      orderBy: { date: "desc" },
    }),
  ]);

  const stageCounts = Object.fromEntries(
    stageBreakdown.map((s) => [s.stage, s._count.stage])
  ) as Record<string, number>;

  return {
    stageCounts,
    overdueFU,
    dueTodayFU,
    newThisWeek,
    recentActivities,
    totalProspects: Object.values(stageCounts).reduce((a, b) => a + b, 0),
    activePipeline: Object.entries(stageCounts)
      .filter(([stage]) => !["PROSPECT", "WON", "LOST"].includes(stage))
      .reduce((a, [, b]) => a + b, 0),
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Astroune POS Sales Pipeline" />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <DashboardMetrics data={data} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PipelineFunnel stageCounts={data.stageCounts} />
          </div>
          <div className="space-y-4">
            <FollowUpWidget
              overdue={data.overdueFU}
              dueToday={data.dueTodayFU}
            />
          </div>
        </div>
        <RecentActivity activities={data.recentActivities} />
      </div>
    </div>
  );
}
