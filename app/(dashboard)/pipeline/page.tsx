import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { KanbanBoard } from "@/components/pipeline/kanban-board";

async function getPipelineData() {
  const prospects = await prisma.prospect.findMany({
    where: { isActive: true },
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
  return prospects;
}

export default async function PipelinePage() {
  const prospects = await getPipelineData();

  return (
    <div className="flex flex-col h-full">
      <Header title="Sales Pipeline" subtitle="Drag cards to move prospects through stages" />
      <div className="flex-1 overflow-hidden p-4">
        <KanbanBoard initialProspects={prospects} />
      </div>
    </div>
  );
}
