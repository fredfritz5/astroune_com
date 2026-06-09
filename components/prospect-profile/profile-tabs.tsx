"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ActivityTab } from "./activity-tab";
import { DiscoveryTab } from "./discovery-tab";
import { PainPointsTab } from "./pain-points-tab";
import { DemoTab } from "./demo-tab";
import { ObjectionsTab } from "./objections-tab";
import { ProposalsTab } from "./proposals-tab";
import { OnboardingTab } from "./onboarding-tab";
import { IntelligenceTab } from "./intelligence-tab";
import { NotesTab } from "./notes-tab";

const tabs = [
  { id: "activities", label: "Activities" },
  { id: "discovery", label: "Discovery" },
  { id: "pain-points", label: "Pain Points" },
  { id: "demos", label: "Demos" },
  { id: "objections", label: "Objections" },
  { id: "proposals", label: "Proposals" },
  { id: "onboarding", label: "Onboarding" },
  { id: "intelligence", label: "Intelligence" },
  { id: "notes", label: "Notes" },
];

export function ProspectProfileTabs({ prospect }: { prospect: ProspectData }) {
  const [activeTab, setActiveTab] = useState("activities");

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "activities" && <ActivityTab prospect={prospect} />}
        {activeTab === "discovery" && <DiscoveryTab prospect={prospect} />}
        {activeTab === "pain-points" && <PainPointsTab prospect={prospect} />}
        {activeTab === "demos" && <DemoTab prospect={prospect} />}
        {activeTab === "objections" && <ObjectionsTab prospect={prospect} />}
        {activeTab === "proposals" && <ProposalsTab prospect={prospect} />}
        {activeTab === "onboarding" && <OnboardingTab prospect={prospect} />}
        {activeTab === "intelligence" && <IntelligenceTab prospect={prospect} />}
        {activeTab === "notes" && <NotesTab prospect={prospect} />}
      </div>
    </div>
  );
}

// Type shared across tab components
export type ProspectData = {
  id: string;
  restaurantName: string;
  stage: string;
  activities: Array<{
    id: string;
    type: string;
    date: Date;
    notes: string | null;
    outcome: string | null;
    nextAction: string | null;
    user: { name: string | null; image: string | null } | null;
  }>;
  followUps: Array<{
    id: string;
    type: string;
    dueDate: Date;
    notes: string | null;
    status: string;
    completedAt: Date | null;
    user: { name: string | null; image: string | null } | null;
  }>;
  discoveryAnswers: Array<{
    id: string;
    category: string;
    question: string;
    answer: string | null;
    isCustom: boolean;
  }>;
  painPoints: Array<{
    id: string;
    category: string;
    description: string;
    severity: number;
    frequency: number;
    notes: string | null;
    createdAt: Date;
  }>;
  demos: Array<{
    id: string;
    demoDate: Date;
    attendees: string | null;
    founderPresent: boolean;
    featuresDemo: string | null;
    prospectFeedback: string | null;
    objectionsRaised: string | null;
    rating: number | null;
    notes: string | null;
    createdAt: Date;
  }>;
  objections: Array<{
    id: string;
    objection: string;
    category: string;
    responseGiven: string | null;
    status: string;
    resolved: boolean;
    notes: string | null;
    createdAt: Date;
  }>;
  proposals: Array<{
    id: string;
    proposalDate: Date;
    recommendedPkg: string | null;
    value: number | null;
    notes: string | null;
    expiryDate: Date | null;
    status: string;
    createdAt: Date;
  }>;
  onboarding: {
    id: string;
    agreementConfirmed: boolean;
    agreementDate: Date | null;
    founderIntroduced: boolean;
    founderIntroDate: Date | null;
    onboardingScheduled: boolean;
    onboardingScheduleDate: Date | null;
    setupStarted: boolean;
    setupStartDate: Date | null;
    setupComplete: boolean;
    setupCompleteDate: Date | null;
    trainingComplete: boolean;
    trainingCompleteDate: Date | null;
    goLive: boolean;
    goLiveDate: Date | null;
    thirtyDayReview: boolean;
    thirtyDayReviewDate: Date | null;
    notes: string | null;
  } | null;
  intelligenceLog: {
    id: string;
    whatsappProcess: string | null;
    mpesaProcess: string | null;
    loyaltySystem: string | null;
    desiredAutomations: string | null;
    digitalMaturity: number | null;
    automationAppetite: number | null;
    futureOpportunities: string | null;
    quotes: Array<{
      id: string;
      quote: string;
      context: string | null;
      date: Date;
    }>;
  } | null;
  notes: Array<{
    id: string;
    title: string | null;
    category: string | null;
    content: string;
    createdAt: Date;
    user: { name: string | null; image: string | null } | null;
  }>;
};
