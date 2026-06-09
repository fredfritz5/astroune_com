import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { ProspectProfileHeader } from "@/components/prospect-profile/profile-header";
import { ProspectProfileTabs } from "@/components/prospect-profile/profile-tabs";

async function getProspect(id: string) {
  return prisma.prospect.findUnique({
    where: { id },
    include: {
      leadOwner: { select: { id: true, name: true, email: true, image: true } },
      activities: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { date: "desc" },
      },
      followUps: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { dueDate: "asc" },
      },
      discoveryAnswers: { orderBy: [{ category: "asc" }, { createdAt: "asc" }] },
      painPoints: { orderBy: { severity: "desc" } },
      demos: { orderBy: { demoDate: "desc" } },
      objections: { orderBy: { createdAt: "desc" } },
      proposals: { orderBy: { proposalDate: "desc" } },
      onboarding: true,
      intelligenceLog: { include: { quotes: { orderBy: { date: "desc" } } } },
      notes: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export default async function ProspectProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prospect = await getProspect(id);

  if (!prospect) notFound();

  return (
    <div className="flex flex-col h-full">
      <Header
        title={prospect.restaurantName}
        subtitle={[prospect.branchName, prospect.area].filter(Boolean).join(" · ")}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <ProspectProfileHeader prospect={prospect} />
          <ProspectProfileTabs prospect={prospect} />
        </div>
      </div>
    </div>
  );
}
