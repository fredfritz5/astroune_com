import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { ProspectForm } from "@/components/prospects/prospect-form";

export default async function EditProspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prospect = await prisma.prospect.findUnique({ where: { id } });

  if (!prospect) notFound();

  return (
    <div className="flex flex-col h-full">
      <Header title={`Edit: ${prospect.restaurantName}`} />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <ProspectForm prospect={prospect} />
        </div>
      </div>
    </div>
  );
}
