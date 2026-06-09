export const PIPELINE_STAGES = [
  { key: "PROSPECT", label: "Prospect", color: "bg-slate-500", textColor: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200" },
  { key: "CONTACTED", label: "Contacted", color: "bg-blue-500", textColor: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "DISCOVERY_DONE", label: "Discovery Done", color: "bg-violet-500", textColor: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  { key: "DEMO_DONE", label: "Demo Done", color: "bg-amber-500", textColor: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "bg-orange-500", textColor: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "NEGOTIATING", label: "Negotiating", color: "bg-pink-500", textColor: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
  { key: "WON", label: "Won", color: "bg-emerald-500", textColor: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "LOST", label: "Lost", color: "bg-red-500", textColor: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
] as const;

export const LEAD_SOURCES = [
  { key: "WALK_IN", label: "Walk-in" },
  { key: "GOOGLE_MAPS", label: "Google Maps" },
  { key: "INSTAGRAM", label: "Instagram" },
  { key: "LINKEDIN", label: "LinkedIn" },
  { key: "REFERRAL", label: "Referral" },
  { key: "GLOVO", label: "Glovo" },
  { key: "UBER_EATS", label: "Uber Eats" },
  { key: "JUMIA_FOOD", label: "Jumia Food" },
  { key: "OTHER", label: "Other" },
] as const;

export const ACTIVITY_TYPES = [
  { key: "WALK_IN_VISIT", label: "Walk-in Visit", icon: "MapPin" },
  { key: "PHONE_CALL", label: "Phone Call", icon: "Phone" },
  { key: "WHATSAPP_MESSAGE", label: "WhatsApp Message", icon: "MessageCircle" },
  { key: "LINKEDIN_MESSAGE", label: "LinkedIn Message", icon: "Linkedin" },
  { key: "EMAIL", label: "Email", icon: "Mail" },
  { key: "DISCOVERY_MEETING", label: "Discovery Meeting", icon: "Search" },
  { key: "DEMO", label: "Demo", icon: "Monitor" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", icon: "FileText" },
  { key: "NEGOTIATION_MEETING", label: "Negotiation Meeting", icon: "Handshake" },
  { key: "FOLLOW_UP", label: "Follow-Up", icon: "Bell" },
  { key: "ONBOARDING_MEETING", label: "Onboarding Meeting", icon: "Users" },
  { key: "OTHER", label: "Other", icon: "MoreHorizontal" },
] as const;

export const FOLLOW_UP_SCHEDULES: Record<string, { days: number; label: string }[]> = {
  CONTACTED: [{ days: 2, label: "2-day follow-up" }, { days: 3, label: "3-day follow-up" }],
  DISCOVERY_DONE: [{ days: 2, label: "2-day follow-up" }, { days: 5, label: "5-day follow-up" }],
  DEMO_DONE: [{ days: 1, label: "Next day follow-up" }, { days: 3, label: "3-day follow-up" }],
  PROPOSAL_SENT: [{ days: 3, label: "3-day follow-up" }, { days: 7, label: "Weekly follow-up" }],
  NEGOTIATING: [{ days: 1, label: "Next day follow-up" }, { days: 3, label: "3-day follow-up" }],
  WON: [{ days: 30, label: "30-day check-in" }, { days: 60, label: "60-day check-in" }, { days: 90, label: "90-day check-in" }],
  LOST: [{ days: 60, label: "60-day re-engagement" }, { days: 180, label: "6-month re-engagement" }],
};

export const NAIROBI_AREAS = [
  "Westlands", "CBD", "Ngong Road", "Karen", "Kilimani", "Lavington",
  "Upperhill", "Kileleshwa", "Parklands", "Hurlingham", "South B",
  "South C", "Langata", "Rongai", "Ruaka", "Gigiri", "Muthaiga",
  "Spring Valley", "Runda", "Ridgeways", "Kasarani", "Thika Road",
  "Embakasi", "Syokimau", "Mlolongo", "Ruiru", "Juja", "Other",
];

export const PAIN_POINT_CATEGORIES = [
  { key: "INVENTORY", label: "Inventory Management" },
  { key: "REPORTING", label: "Reporting & Analytics" },
  { key: "STAFF", label: "Staff Management" },
  { key: "SALES", label: "Sales Tracking" },
  { key: "PROCUREMENT", label: "Procurement" },
  { key: "DELIVERY", label: "Delivery Operations" },
  { key: "CUSTOMER", label: "Customer Management" },
] as const;

export const DISCOVERY_CATEGORIES = [
  {
    key: "ORDERS_AND_SALES",
    label: "Orders & Sales",
    questions: [
      "How do orders flow from table to kitchen?",
      "How do you currently report on daily sales?",
      "Have you experienced lost orders? How often?",
      "How do you handle split bills and different payment methods?",
    ],
  },
  {
    key: "INVENTORY",
    label: "Inventory",
    questions: [
      "How do you currently manage stock?",
      "Describe your procurement process.",
      "How often do you run out of key ingredients?",
      "Do you track wastage? How?",
    ],
  },
  {
    key: "FINANCE",
    label: "Finance",
    questions: [
      "How do you generate monthly financial reports?",
      "Do you have visibility into your profit margins per dish?",
      "How do you track profitability across branches?",
      "What payment methods do you currently accept?",
    ],
  },
  {
    key: "STAFF",
    label: "Staff",
    questions: [
      "How do you track staff attendance and performance?",
      "How is payroll currently managed?",
      "Are operations dependent on the owner being present?",
      "How many staff members do you have?",
    ],
  },
  {
    key: "GROWTH",
    label: "Growth",
    questions: [
      "Do you have plans to open new branches?",
      "What is your biggest operational challenge right now?",
      "What does success look like for your restaurant in 2 years?",
    ],
  },
] as const;

export const OBJECTION_CATEGORIES = [
  { key: "PRICE", label: "Price" },
  { key: "EXISTING_SYSTEM", label: "Already have a system" },
  { key: "TIMING", label: "Not the right time" },
  { key: "THINK_ABOUT_IT", label: "Need to think about it" },
  { key: "TRUST", label: "Trust concerns" },
  { key: "FEATURES", label: "Missing features" },
  { key: "CONTRACT", label: "Contract concerns" },
  { key: "OTHER", label: "Other" },
] as const;

export const PROPOSAL_PACKAGES = [
  "Starter - POS Only",
  "Growth - POS + Inventory",
  "Professional - Full Suite",
  "Enterprise - Multi-Branch",
  "Custom Package",
];
