import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { FollowUpList } from "@/components/follow-ups/follow-up-list";

async function getFollowUps(filter: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const where: Record<string, unknown> = { status: "PENDING" };

  if (filter === "today") where.dueDate = { gte: today, lt: tomorrow };
  else if (filter === "overdue") where.dueDate = { lt: today };
  else if (filter === "upcoming") where.dueDate = { gte: tomorrow, lte: nextWeek };

  const [followUps, overdueCnt, todayCnt, upcomingCnt] = await Promise.all([
    prisma.followUp.findMany({
      where,
      include: {
        prospect: { select: { id: true, restaurantName: true, stage: true, area: true } },
        user: { select: { name: true, image: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.followUp.count({ where: { status: "PENDING", dueDate: { lt: today } } }),
    prisma.followUp.count({ where: { status: "PENDING", dueDate: { gte: today, lt: tomorrow } } }),
    prisma.followUp.count({ where: { status: "PENDING", dueDate: { gte: tomorrow, lte: nextWeek } } }),
  ]);

  return { followUps, overdueCnt, todayCnt, upcomingCnt };
}

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const { followUps, overdueCnt, todayCnt, upcomingCnt } = await getFollowUps(filter);

  return (
    <div className="flex flex-col h-full">
      <Header title="Follow-Ups" subtitle="Track and complete all scheduled follow-ups" />
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <FollowUpList
          followUps={followUps}
          activeFilter={filter}
          overdueCnt={overdueCnt}
          todayCnt={todayCnt}
          upcomingCnt={upcomingCnt}
        />
      </div>
    </div>
  );
}
