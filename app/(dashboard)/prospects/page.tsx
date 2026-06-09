import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { ProspectTable } from "@/components/prospects/prospect-table";
import { StageFilterBar } from "@/components/prospects/stage-filter-bar";

interface SearchParams {
  stage?: string;
  area?: string;
  source?: string;
  search?: string;
}

async function getProspects(filters: SearchParams) {
  const where: Record<string, unknown> = { isActive: true };

  if (filters.stage) where.stage = filters.stage;
  if (filters.area) where.area = filters.area;
  if (filters.source) where.source = filters.source;
  if (filters.search) {
    where.OR = [
      { restaurantName: { contains: filters.search, mode: "insensitive" } },
      { contactPerson: { contains: filters.search, mode: "insensitive" } },
      { area: { contains: filters.search, mode: "insensitive" } },
      { location: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.prospect.findMany({
    where,
    include: {
      leadOwner: { select: { name: true, image: true } },
      _count: {
        select: {
          activities: true,
          followUps: { where: { status: "PENDING" } },
        },
      },
    },
    orderBy: [{ priorityScore: "desc" }, { updatedAt: "desc" }],
  });
}

async function getStageCounts() {
  const counts = await prisma.prospect.groupBy({
    by: ["stage"],
    where: { isActive: true },
    _count: { stage: true },
  });
  return Object.fromEntries(counts.map((c) => [c.stage, c._count.stage]));
}

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [prospects, stageCounts] = await Promise.all([
    getProspects(params),
    getStageCounts(),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Prospects"
        subtitle={`${prospects.length} restaurant${prospects.length !== 1 ? "s" : ""}`}
      />
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <StageFilterBar stageCounts={stageCounts} activeStage={params.stage} />
        <ProspectTable prospects={prospects} />
      </div>
    </div>
  );
}
