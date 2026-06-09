"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FollowUpSchema } from "@/lib/validations";

export async function createFollowUp(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = FollowUpSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, dueDate, ...data } = parsed.data;

  await prisma.followUp.create({
    data: {
      ...data,
      prospectId,
      userId: session.user.id,
      dueDate: new Date(dueDate),
    },
  });

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/follow-ups");
  revalidatePath("/");
  return { success: true };
}

export async function completeFollowUp(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const followUp = await prisma.followUp.update({
    where: { id },
    data: { status: "COMPLETED", completedAt: new Date() },
    select: { prospectId: true },
  });

  revalidatePath(`/prospects/${followUp.prospectId}`);
  revalidatePath("/follow-ups");
  revalidatePath("/");
  return { success: true };
}

export async function rescheduleFollowUp(id: string, newDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const followUp = await prisma.followUp.update({
    where: { id },
    data: { status: "RESCHEDULED", dueDate: new Date(newDate) },
    select: { prospectId: true },
  });

  revalidatePath(`/prospects/${followUp.prospectId}`);
  revalidatePath("/follow-ups");
  revalidatePath("/");
  return { success: true };
}

export async function getFollowUps(filter: "all" | "today" | "overdue" | "upcoming" = "all") {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const where: Record<string, unknown> = { status: "PENDING" };

  if (filter === "today") {
    where.dueDate = { gte: today, lt: tomorrow };
  } else if (filter === "overdue") {
    where.dueDate = { lt: today };
  } else if (filter === "upcoming") {
    where.dueDate = { gte: tomorrow, lte: nextWeek };
  }

  return prisma.followUp.findMany({
    where,
    include: {
      prospect: { select: { id: true, restaurantName: true, stage: true, area: true } },
      user: { select: { name: true, image: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getDashboardFollowUpStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [overdue, dueToday, upcoming] = await Promise.all([
    prisma.followUp.count({
      where: { status: "PENDING", dueDate: { lt: today } },
    }),
    prisma.followUp.count({
      where: { status: "PENDING", dueDate: { gte: today, lt: tomorrow } },
    }),
    prisma.followUp.count({
      where: { status: "PENDING", dueDate: { gte: tomorrow } },
    }),
  ]);

  return { overdue, dueToday, upcoming };
}
