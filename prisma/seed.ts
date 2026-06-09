import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PipelineStage, LeadSource, ActivityType, FollowUpType } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPwd = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@astroune.com" },
    update: {},
    create: {
      email: "admin@astroune.com",
      name: "James Ochieng",
      password: hashedPwd,
      role: "ADMIN",
    },
  });

  const salesRep = await prisma.user.upsert({
    where: { email: "sales@astroune.com" },
    update: {},
    create: {
      email: "sales@astroune.com",
      name: "Amina Wanjiku",
      password: hashedPwd,
      role: "SALES_REP",
    },
  });

  console.log("Users created:", admin.email, salesRep.email);

  type ProspectSeed = {
    restaurantName: string; branchName?: string; location?: string; area?: string;
    contactPerson?: string; position?: string; phone?: string; whatsapp?: string;
    email?: string; instagram?: string; linkedin?: string;
    source: LeadSource; numberOfBranches?: number; currentPosStatus?: string;
    existingSystem?: string | null; estimatedDailyOrders?: number;
    estimatedRevenue?: number; automationAppetite?: number; priorityScore?: number;
    stage: PipelineStage; lostReason?: string; leadOwnerId: string;
  };

  // Realistic Nairobi restaurant prospects
  const prospectsData: ProspectSeed[] = [
    {
      restaurantName: "Nyama Mama",
      branchName: "Westlands Branch",
      location: "Westgate Shopping Mall, Ground Floor",
      area: "Westlands",
      contactPerson: "Michael Kamau",
      position: "Operations Manager",
      phone: "+254 722 111 001",
      whatsapp: "+254 722 111 001",
      email: "ops@nyamamama.co.ke",
      instagram: "@nyamamama",
      source: "GOOGLE_MAPS",
      numberOfBranches: 4,
      currentPosStatus: "Old POS",
      existingSystem: "iKoze",
      estimatedDailyOrders: 180,
      estimatedRevenue: 2500000,
      automationAppetite: 4,
      priorityScore: 9,
      stage: "PROPOSAL_SENT",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "The Nairobi Kitchen",
      branchName: "CBD Branch",
      location: "Kimathi Street, Nairobi",
      area: "CBD",
      contactPerson: "Grace Mwangi",
      position: "Owner",
      phone: "+254 733 222 002",
      whatsapp: "+254 733 222 002",
      email: "grace@nairobikitchen.co.ke",
      source: "WALK_IN",
      numberOfBranches: 1,
      currentPosStatus: "No POS",
      existingSystem: null,
      estimatedDailyOrders: 60,
      estimatedRevenue: 450000,
      automationAppetite: 3,
      priorityScore: 7,
      stage: "DEMO_DONE",
      leadOwnerId: salesRep.id,
    },
    {
      restaurantName: "Kiza Lounge & Restaurant",
      location: "Kilimani, off Argwings Kodhek",
      area: "Kilimani",
      contactPerson: "David Njoroge",
      position: "CEO",
      phone: "+254 721 333 003",
      whatsapp: "+254 721 333 003",
      email: "david@kizalounge.co.ke",
      instagram: "@kizalounge",
      linkedin: "linkedin.com/company/kiza-lounge",
      source: "INSTAGRAM",
      numberOfBranches: 2,
      currentPosStatus: "Basic POS",
      existingSystem: "Loyverse",
      estimatedDailyOrders: 150,
      estimatedRevenue: 3200000,
      automationAppetite: 5,
      priorityScore: 10,
      stage: "NEGOTIATING",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "Java House",
      branchName: "Ngong Road",
      location: "Nakumatt Junction, Ngong Road",
      area: "Ngong Road",
      contactPerson: "Sarah Otieno",
      position: "Branch Manager",
      phone: "+254 744 444 004",
      whatsapp: "+254 744 444 004",
      source: "REFERRAL",
      numberOfBranches: 1,
      currentPosStatus: "Old POS",
      existingSystem: "Custom system",
      estimatedDailyOrders: 250,
      estimatedRevenue: 1800000,
      automationAppetite: 4,
      priorityScore: 8,
      stage: "DISCOVERY_DONE",
      leadOwnerId: salesRep.id,
    },
    {
      restaurantName: "Swahili Beach Restaurant",
      location: "Karen, off Karen Road",
      area: "Karen",
      contactPerson: "Ahmed Hassan",
      position: "Owner",
      phone: "+254 722 555 005",
      whatsapp: "+254 722 555 005",
      email: "ahmed@swahilibeach.co.ke",
      source: "LINKEDIN",
      numberOfBranches: 1,
      currentPosStatus: "No POS",
      estimatedDailyOrders: 40,
      estimatedRevenue: 600000,
      automationAppetite: 2,
      priorityScore: 5,
      stage: "CONTACTED",
      leadOwnerId: salesRep.id,
    },
    {
      restaurantName: "Artcaffe",
      branchName: "Upperhill",
      location: "Britam Tower, Upperhill",
      area: "Upperhill",
      contactPerson: "Priya Patel",
      position: "Regional Manager",
      phone: "+254 733 666 006",
      email: "priya.patel@artcaffe.co.ke",
      source: "GOOGLE_MAPS",
      numberOfBranches: 12,
      currentPosStatus: "Competitor POS",
      existingSystem: "Micros/Oracle",
      estimatedDailyOrders: 300,
      estimatedRevenue: 4500000,
      automationAppetite: 5,
      priorityScore: 9,
      stage: "CONTACTED",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "Lord Erroll Gourmet Restaurant",
      location: "Runda, off Runda Drive",
      area: "Runda",
      contactPerson: "Jean-Pierre Moreau",
      position: "Executive Chef & Owner",
      phone: "+254 721 777 007",
      whatsapp: "+254 721 777 007",
      email: "jp@lorderroll.co.ke",
      source: "REFERRAL",
      numberOfBranches: 1,
      currentPosStatus: "Old POS",
      estimatedDailyOrders: 35,
      estimatedRevenue: 800000,
      automationAppetite: 2,
      priorityScore: 6,
      stage: "PROSPECT",
      leadOwnerId: salesRep.id,
    },
    {
      restaurantName: "Chicken Inn",
      branchName: "Thika Road Mall",
      location: "Thika Road Mall, Roysambu",
      area: "Thika Road",
      contactPerson: "Faith Wanjiru",
      position: "Franchise Manager",
      phone: "+254 722 888 008",
      source: "GLOVO",
      numberOfBranches: 3,
      currentPosStatus: "Basic POS",
      estimatedDailyOrders: 400,
      estimatedRevenue: 900000,
      automationAppetite: 4,
      priorityScore: 7,
      stage: "PROSPECT",
      leadOwnerId: salesRep.id,
    },
    {
      restaurantName: "Mama Oliech Restaurant",
      location: "Hurlingham, off Argwings Kodhek Road",
      area: "Hurlingham",
      contactPerson: "Oliech Amboka",
      position: "Owner",
      phone: "+254 733 999 009",
      whatsapp: "+254 733 999 009",
      source: "WALK_IN",
      numberOfBranches: 2,
      currentPosStatus: "No POS",
      estimatedDailyOrders: 120,
      estimatedRevenue: 850000,
      automationAppetite: 3,
      priorityScore: 7,
      stage: "DEMO_DONE",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "Hashmi BBQ",
      location: "Parklands, 3rd Avenue",
      area: "Parklands",
      contactPerson: "Younus Hashmi",
      position: "CEO",
      phone: "+254 722 100 010",
      whatsapp: "+254 722 100 010",
      instagram: "@hashmibbq",
      source: "INSTAGRAM",
      numberOfBranches: 3,
      currentPosStatus: "Basic POS",
      existingSystem: "Square",
      estimatedDailyOrders: 100,
      estimatedRevenue: 1200000,
      automationAppetite: 4,
      priorityScore: 8,
      stage: "PROPOSAL_SENT",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "Carnivore Restaurant",
      location: "Langata Road, near Wilson Airport",
      area: "Langata",
      contactPerson: "Simon Gatheru",
      position: "General Manager",
      phone: "+254 733 200 011",
      email: "simon@carnivore.co.ke",
      source: "REFERRAL",
      numberOfBranches: 1,
      currentPosStatus: "Old POS",
      existingSystem: "Custom Enterprise System",
      estimatedDailyOrders: 500,
      estimatedRevenue: 8000000,
      automationAppetite: 5,
      priorityScore: 10,
      stage: "WON",
      leadOwnerId: admin.id,
    },
    {
      restaurantName: "The Rusty Nail",
      location: "Lavington, Valley Arcade",
      area: "Lavington",
      contactPerson: "Emily Wambua",
      position: "Owner",
      phone: "+254 721 300 012",
      whatsapp: "+254 721 300 012",
      source: "GOOGLE_MAPS",
      numberOfBranches: 1,
      currentPosStatus: "No POS",
      estimatedDailyOrders: 45,
      estimatedRevenue: 350000,
      automationAppetite: 2,
      priorityScore: 4,
      stage: "LOST",
      lostReason: "Too expensive for their current revenue",
      leadOwnerId: salesRep.id,
    },
  ];

  for (const prospectData of prospectsData) {
    const { stage, lostReason, leadOwnerId, ...rest } = prospectData;

    const prospect = await prisma.prospect.create({
      data: {
        ...rest,
        stage,
        lostReason: lostReason ?? null,
        leadOwnerId,
        stageHistory: {
          create: {
            toStage: stage,
            changedById: leadOwnerId,
          },
        },
      },
    });

    // Add activities for each prospect based on stage
    const stageOrder: PipelineStage[] = ["PROSPECT", "CONTACTED", "DISCOVERY_DONE", "DEMO_DONE", "PROPOSAL_SENT", "NEGOTIATING", "WON", "LOST"];
    const stageIdx = stageOrder.indexOf(stage);
    type ActivitySeed = { type: ActivityType; date: Date; notes: string; outcome: string; nextAction?: string; prospectId: string; userId: string };
    const activitiesToAdd: ActivitySeed[] = [];

    if (stageIdx >= 1) {
      activitiesToAdd.push({
        type: "PHONE_CALL",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        notes: "Initial outreach call. Introduced Astroune POS solution.",
        outcome: "Interested, asked for more info. Scheduled discovery meeting.",
        prospectId: prospect.id,
        userId: leadOwnerId,
      });
    }
    if (stageIdx >= 2) {
      activitiesToAdd.push({
        type: "DISCOVERY_MEETING",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: "Discovery meeting conducted at their location. Identified key pain points around inventory and reporting.",
        outcome: "Owner very interested. Shared current challenges with their existing system.",
        nextAction: "Schedule product demo",
        prospectId: prospect.id,
        userId: leadOwnerId,
      });
    }
    if (stageIdx >= 3) {
      activitiesToAdd.push({
        type: "DEMO",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: "Full product demo including POS, inventory, and reporting modules.",
        outcome: "Very positive reaction. Owner impressed with inventory management features.",
        nextAction: "Send proposal",
        prospectId: prospect.id,
        userId: leadOwnerId,
      });
    }

    if (activitiesToAdd.length > 0) {
      await prisma.activity.createMany({ data: activitiesToAdd });
    }

    // Add follow-up based on stage
    if (!["WON", "LOST"].includes(stage)) {
      const daysUntilFollowUp: Partial<Record<PipelineStage, number>> = {
        PROSPECT: 2,
        CONTACTED: 3,
        DISCOVERY_DONE: 2,
        DEMO_DONE: 2,
        PROPOSAL_SENT: 5,
        NEGOTIATING: 1,
      };

      const days = daysUntilFollowUp[stage] ?? 3;
      await prisma.followUp.create({
        data: {
          prospectId: prospect.id,
          userId: leadOwnerId,
          dueDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
          type: "CALL" as FollowUpType,
          status: "PENDING",
          notes: `Follow-up after ${stage.replace(/_/g, " ").toLowerCase()}`,
        },
      });
    }

    // Add pain points for advanced stage prospects
    if (stageIdx >= 2) {
      await prisma.painPoint.createMany({
        data: [
          {
            prospectId: prospect.id,
            category: "INVENTORY",
            description: "No real-time stock visibility. Staff manually count stock daily.",
            severity: 4,
            frequency: 5,
          },
          {
            prospectId: prospect.id,
            category: "REPORTING",
            description: "End-of-day reporting takes 2 hours manually. No automated reports.",
            severity: 3,
            frequency: 5,
          },
        ],
      });
    }

    // Add onboarding for WON prospects
    if (stage === "WON") {
      await prisma.onboarding.create({
        data: {
          prospectId: prospect.id,
          agreementConfirmed: true,
          agreementDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          founderIntroduced: true,
          founderIntroDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          onboardingScheduled: true,
          onboardingScheduleDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          setupStarted: false,
        },
      });
    }
  }

  // Add overdue follow-ups (for testing dashboard)
  const firstProspect = await prisma.prospect.findFirst({ where: { isActive: true } });
  if (firstProspect) {
    await prisma.followUp.create({
      data: {
        prospectId: firstProspect.id,
        userId: admin.id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        type: "WHATSAPP",
        status: "PENDING",
        notes: "Send proposal follow-up via WhatsApp",
      },
    });
  }

  console.log(`Seeded ${prospectsData.length} prospects`);
  console.log("\n--- Login Credentials ---");
  console.log("Admin: admin@astroune.com / password123");
  console.log("Sales: sales@astroune.com / password123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
