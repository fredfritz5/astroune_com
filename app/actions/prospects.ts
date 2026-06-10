"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProspectSchema, StageUpdateSchema } from "@/lib/validations";
import { addDays } from "@/lib/utils";
import { FOLLOW_UP_SCHEDULES } from "@/lib/constants";

export async function createProspect(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = ProspectSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const data = parsed.data;

  const prospect = await prisma.prospect.create({
    data: {
      ...data,
      email: data.email || null,
      leadOwnerId: data.leadOwnerId || session.user.id,
      stageHistory: {
        create: {
          toStage: "PROSPECT",
          changedById: session.user.id,
        },
      },
    },
  });

  // Auto-create initial follow-up
  await prisma.followUp.create({
    data: {
      prospectId: prospect.id,
      userId: session.user.id,
      dueDate: addDays(new Date(), 2),
      type: "CALL",
      notes: "Initial outreach follow-up",
    },
  });

  revalidatePath("/prospects");
  revalidatePath("/pipeline");
  return { success: true, id: prospect.id };
}

export async function updateProspect(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = ProspectSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const data = parsed.data;
  await prisma.prospect.update({
    where: { id },
    data: { ...data, email: data.email || null },
  });

  revalidatePath(`/prospects/${id}`);
  revalidatePath("/prospects");
  revalidatePath("/pipeline");
  return { success: true };
}

export async function updateProspectStage(data: { prospectId: string; stage: string; notes?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = StageUpdateSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, stage, notes } = parsed.data;

  const current = await prisma.prospect.findUnique({
    where: { id: prospectId },
    select: { stage: true },
  });

  if (!current) throw new Error("Prospect not found");

  await prisma.$transaction([
    prisma.prospect.update({
      where: { id: prospectId },
      data: { stage: stage as never },
    }),
    prisma.stageHistory.create({
      data: {
        prospectId,
        fromStage: current.stage,
        toStage: stage as never,
        changedById: session.user.id,
        notes,
      },
    }),
    prisma.activity.create({
      data: {
        prospectId,
        userId: session.user.id,
        type: "OTHER",
        date: new Date(),
        notes: `Stage changed from ${current.stage} to ${stage}${notes ? `: ${notes}` : ""}`,
      },
    }),
  ]);

  // Auto-schedule follow-up based on stage
  const schedules = FOLLOW_UP_SCHEDULES[stage];
  if (schedules && schedules.length > 0) {
    const schedule = schedules[0];
    await prisma.followUp.create({
      data: {
        prospectId,
        userId: session.user.id,
        dueDate: addDays(new Date(), schedule.days),
        type: "CALL",
        notes: `Auto-scheduled: ${schedule.label} after moving to ${stage}`,
      },
    });
  }

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/pipeline");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProspect(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.prospect.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/prospects");
  revalidatePath("/pipeline");
  return { success: true };
}

export async function getProspects(filters?: {
  stage?: string;
  area?: string;
  source?: string;
  search?: string;
  leadOwnerId?: string;
}) {
  const where: Record<string, unknown> = { isActive: true };

  if (filters?.stage) where.stage = filters.stage;
  if (filters?.area) where.area = filters.area;
  if (filters?.source) where.source = filters.source;
  if (filters?.leadOwnerId) where.leadOwnerId = filters.leadOwnerId;
  if (filters?.search) {
    where.OR = [
      { restaurantName: { contains: filters.search, mode: "insensitive" } },
      { contactPerson: { contains: filters.search, mode: "insensitive" } },
      { area: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.prospect.findMany({
    where,
    include: {
      leadOwner: { select: { name: true, email: true, image: true } },
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

export async function getProspect(id: string) {
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
      discoveryAnswers: { orderBy: { category: "asc" } },
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
      },
    },
  });
}
