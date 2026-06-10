"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  NoteSchema, PainPointSchema, DemoSchema, ObjectionSchema,
  ProposalSchema, OnboardingSchema, IntelligenceLogSchema,
  QuoteSchema, DiscoveryAnswerSchema,
} from "@/lib/validations";

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = NoteSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;

  await prisma.note.create({
    data: { ...data, prospectId, userId: session.user.id },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function updateNote(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = NoteSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;

  await prisma.note.update({ where: { id }, data });
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Pain Points ──────────────────────────────────────────────────────────────

export async function createPainPoint(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = PainPointSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;
  await prisma.painPoint.create({ data: { ...data, prospectId } });
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function updatePainPoint(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = PainPointSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;
  await prisma.painPoint.update({ where: { id }, data });
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Discovery ────────────────────────────────────────────────────────────────

export async function upsertDiscoveryAnswer(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = DiscoveryAnswerSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, category, question, answer, isCustom } = parsed.data;

  const existing = await prisma.discoveryAnswer.findFirst({
    where: { prospectId, category, question },
  });

  if (existing) {
    await prisma.discoveryAnswer.update({
      where: { id: existing.id },
      data: { answer: answer ?? null },
    });
  } else {
    await prisma.discoveryAnswer.create({
      data: { prospectId, category, question, answer: answer ?? null, isCustom },
    });
  }

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Demos ────────────────────────────────────────────────────────────────────

export async function createDemo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = DemoSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, demoDate, ...data } = parsed.data;

  await prisma.demo.create({
    data: { ...data, prospectId, demoDate: new Date(demoDate) },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function updateDemo(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = DemoSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, demoDate, ...data } = parsed.data;
  await prisma.demo.update({ where: { id }, data: { ...data, demoDate: new Date(demoDate) } });
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Objections ───────────────────────────────────────────────────────────────

export async function createObjection(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = ObjectionSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;
  await prisma.objection.create({ data: { ...data, prospectId } });
  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function resolveObjection(id: string, prospectId: string, responseGiven?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.objection.update({
    where: { id },
    data: { status: "RESOLVED", resolved: true, responseGiven: responseGiven ?? undefined },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export async function createProposal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = ProposalSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, proposalDate, expiryDate, ...data } = parsed.data;

  await prisma.proposal.create({
    data: {
      ...data,
      prospectId,
      proposalDate: new Date(proposalDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function updateProposalStatus(id: string, status: string, prospectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.proposal.update({
    where: { id },
    data: { status: status as never },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function upsertOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = OnboardingSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;

  const parseDate = (d?: string) => (d ? new Date(d) : null);

  const upsertData = {
    agreementConfirmed: data.agreementConfirmed,
    agreementDate: parseDate(data.agreementDate),
    founderIntroduced: data.founderIntroduced,
    founderIntroDate: parseDate(data.founderIntroDate),
    onboardingScheduled: data.onboardingScheduled,
    onboardingScheduleDate: parseDate(data.onboardingScheduleDate),
    setupStarted: data.setupStarted,
    setupStartDate: parseDate(data.setupStartDate),
    setupComplete: data.setupComplete,
    setupCompleteDate: parseDate(data.setupCompleteDate),
    trainingComplete: data.trainingComplete,
    trainingCompleteDate: parseDate(data.trainingCompleteDate),
    goLive: data.goLive,
    goLiveDate: parseDate(data.goLiveDate),
    thirtyDayReview: data.thirtyDayReview,
    thirtyDayReviewDate: parseDate(data.thirtyDayReviewDate),
    notes: data.notes,
  };

  await prisma.onboarding.upsert({
    where: { prospectId },
    update: upsertData,
    create: { ...upsertData, prospectId },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

// ─── Intelligence Log ─────────────────────────────────────────────────────────

export async function upsertIntelligenceLog(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = IntelligenceLogSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { prospectId, ...data } = parsed.data;

  await prisma.intelligenceLog.upsert({
    where: { prospectId },
    update: data,
    create: { ...data, prospectId },
  });

  revalidatePath(`/prospects/${prospectId}`);
  return { success: true };
}

export async function addQuote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, v === "" ? undefined : v])
  );
  const parsed = QuoteSchema.safeParse(raw);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const { intelligenceLogId, date, ...data } = parsed.data;

  const log = await prisma.intelligenceLog.findUnique({
    where: { id: intelligenceLogId },
    select: { prospectId: true },
  });

  await prisma.quote.create({
    data: {
      ...data,
      intelligenceLogId,
      date: date ? new Date(date) : new Date(),
    },
  });

  if (log) revalidatePath(`/prospects/${log.prospectId}`);
  return { success: true };
}
