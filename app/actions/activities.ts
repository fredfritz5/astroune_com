"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ActivitySchema } from "@/lib/validations";

export async function createActivity(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = ActivitySchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, date, ...data } = parsed.data;

  const activity = await prisma.activity.create({
    data: {
      ...data,
      prospectId,
      userId: session.user.id,
      date: new Date(date),
    },
  });

  await prisma.prospect.update({
    where: { id: prospectId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/prospects/${prospectId}`);
  revalidatePath("/");
  return { success: true, id: activity.id };
}

export async function updateActivity(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData.entries());
  const parsed = ActivitySchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, date, ...data } = parsed.data;

  await prisma.activity.update({
    where: { id },
    data: { ...data, date: new Date(date) },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function getRecentActivities(limit = 20) {
  return prisma.activity.findMany({
    take: limit,
    include: {
      prospect: { select: { restaurantName: true } },
      user: { select: { name: true, image: true } },
    },
    orderBy: { date: "desc" },
  });
}
