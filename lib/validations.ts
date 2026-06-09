import { z } from "zod";

export const ProspectSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  branchName: z.string().optional(),
  location: z.string().optional(),
  area: z.string().optional(),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  source: z.enum(["WALK_IN", "GOOGLE_MAPS", "INSTAGRAM", "LINKEDIN", "REFERRAL", "GLOVO", "UBER_EATS", "JUMIA_FOOD", "OTHER"]).optional(),
  numberOfBranches: z.coerce.number().int().positive().optional(),
  currentPosStatus: z.string().optional(),
  existingSystem: z.string().optional(),
  estimatedDailyOrders: z.coerce.number().int().nonnegative().optional(),
  estimatedRevenue: z.coerce.number().nonnegative().optional(),
  automationAppetite: z.coerce.number().int().min(1).max(5).optional(),
  priorityScore: z.coerce.number().int().min(0).max(10).optional(),
  leadOwnerId: z.string().optional(),
});

export const ActivitySchema = z.object({
  prospectId: z.string().min(1),
  type: z.enum([
    "WALK_IN_VISIT", "PHONE_CALL", "WHATSAPP_MESSAGE", "LINKEDIN_MESSAGE",
    "EMAIL", "DISCOVERY_MEETING", "DEMO", "PROPOSAL_SENT",
    "NEGOTIATION_MEETING", "FOLLOW_UP", "ONBOARDING_MEETING", "OTHER",
  ]),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  outcome: z.string().optional(),
  nextAction: z.string().optional(),
});

export const FollowUpSchema = z.object({
  prospectId: z.string().min(1),
  dueDate: z.string().min(1, "Due date is required"),
  type: z.enum(["CALL", "WHATSAPP", "EMAIL", "MEETING", "DEMO", "PROPOSAL_FOLLOW_UP", "CHECK_IN", "RE_ENGAGEMENT"]),
  notes: z.string().optional(),
});

export const NoteSchema = z.object({
  prospectId: z.string().min(1),
  title: z.string().optional(),
  category: z.string().optional(),
  content: z.string().min(1, "Note content is required"),
});

export const DiscoveryAnswerSchema = z.object({
  prospectId: z.string().min(1),
  category: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().optional(),
  isCustom: z.boolean().default(false),
});

export const PainPointSchema = z.object({
  prospectId: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1, "Description is required"),
  severity: z.coerce.number().int().min(1).max(5),
  frequency: z.coerce.number().int().min(1).max(5),
  notes: z.string().optional(),
});

export const DemoSchema = z.object({
  prospectId: z.string().min(1),
  demoDate: z.string().min(1, "Demo date is required"),
  attendees: z.string().optional(),
  founderPresent: z.boolean().default(false),
  featuresDemo: z.string().optional(),
  prospectFeedback: z.string().optional(),
  objectionsRaised: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export const ObjectionSchema = z.object({
  prospectId: z.string().min(1),
  objection: z.string().min(1, "Objection is required"),
  category: z.enum(["PRICE", "EXISTING_SYSTEM", "TIMING", "THINK_ABOUT_IT", "TRUST", "FEATURES", "CONTRACT", "OTHER"]),
  responseGiven: z.string().optional(),
  notes: z.string().optional(),
});

export const ProposalSchema = z.object({
  prospectId: z.string().min(1),
  proposalDate: z.string().min(1, "Proposal date is required"),
  recommendedPkg: z.string().optional(),
  value: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "VIEWED", "NEGOTIATING", "ACCEPTED", "REJECTED"]).default("DRAFT"),
});

export const OnboardingSchema = z.object({
  prospectId: z.string().min(1),
  agreementConfirmed: z.boolean().default(false),
  agreementDate: z.string().optional(),
  founderIntroduced: z.boolean().default(false),
  founderIntroDate: z.string().optional(),
  onboardingScheduled: z.boolean().default(false),
  onboardingScheduleDate: z.string().optional(),
  setupStarted: z.boolean().default(false),
  setupStartDate: z.string().optional(),
  setupComplete: z.boolean().default(false),
  setupCompleteDate: z.string().optional(),
  trainingComplete: z.boolean().default(false),
  trainingCompleteDate: z.string().optional(),
  goLive: z.boolean().default(false),
  goLiveDate: z.string().optional(),
  thirtyDayReview: z.boolean().default(false),
  thirtyDayReviewDate: z.string().optional(),
  notes: z.string().optional(),
});

export const IntelligenceLogSchema = z.object({
  prospectId: z.string().min(1),
  whatsappProcess: z.string().optional(),
  mpesaProcess: z.string().optional(),
  loyaltySystem: z.string().optional(),
  desiredAutomations: z.string().optional(),
  digitalMaturity: z.coerce.number().int().min(1).max(5).optional(),
  automationAppetite: z.coerce.number().int().min(1).max(5).optional(),
  futureOpportunities: z.string().optional(),
});

export const QuoteSchema = z.object({
  intelligenceLogId: z.string().min(1),
  quote: z.string().min(1, "Quote text is required"),
  context: z.string().optional(),
  date: z.string().optional(),
});

export const StageUpdateSchema = z.object({
  prospectId: z.string().min(1),
  stage: z.enum(["PROSPECT", "CONTACTED", "DISCOVERY_DONE", "DEMO_DONE", "PROPOSAL_SENT", "NEGOTIATING", "WON", "LOST"]),
  notes: z.string().optional(),
});

export type ProspectInput = z.infer<typeof ProspectSchema>;
export type ActivityInput = z.infer<typeof ActivitySchema>;
export type FollowUpInput = z.infer<typeof FollowUpSchema>;
export type NoteInput = z.infer<typeof NoteSchema>;
export type PainPointInput = z.infer<typeof PainPointSchema>;
export type DemoInput = z.infer<typeof DemoSchema>;
export type ObjectionInput = z.infer<typeof ObjectionSchema>;
export type ProposalInput = z.infer<typeof ProposalSchema>;
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
