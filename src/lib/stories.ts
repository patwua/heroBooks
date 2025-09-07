export interface Story {
  id: string;
  slug: string;
  title: string;
  persona: { name: string; role: string; location: string };
  image_src: string;
  image_alt?: string;
  teaser: string;
  summary_lines: string[];
  features_used: string[];
  cta_label: string;
  cta_href: string;
  try_setup_href: string;
  tags: string[];
  published_at: string | null;
  consent_obtained: boolean;
  anonymized: boolean;
}

export const stories: Story[] = [
  {
    id: "story_retail_sasha_georgetown",
    slug: "sasha-retail-georgetown",
    title: "Sales tidy, VAT on time",
    persona: { name: "Sasha", role: "Shop Owner", location: "Georgetown" },
    image_src: "/photos/landing/accounting-1024x640.webp",
    teaser: "How Sasha uses daily sales tracking to stay VAT-ready.",
    summary_lines: [
      "Logged daily sales and expenses so VAT is always up to date.",
      "Used bank import rules to reconcile cash and card quickly.",
      "Filed VAT without the usual month-end scramble.",
    ],
    features_used: ["Sales tracking", "Bank import & rules", "VAT returns"],
    cta_label: "See retail tools",
    cta_href: "/features/retail",
    try_setup_href: "/features?stack=retail_simple",
    tags: ["retail", "vat", "bank-import", "guyana"],
    published_at: "2024-05-01",
    consent_obtained: true,
    anonymized: false,
  },
  {
    id: "story_beauty_maya_eastbank",
    slug: "maya-beauty-eastbank",
    title: "Invoices from the chair",
    persona: { name: "Maya", role: "Stylist", location: "East Bank" },
    image_src: "/photos/landing/salon-1024x640.webp",
    teaser: "How Maya uses mobile invoicing and PAYE payroll to keep chairs turning.",
    summary_lines: [
      "Sent invoices from the chair and tracked payments by client.",
      "Ran PAYE payroll each week without spreadsheets.",
      "Grouped product sales and tips for clean month-end reports.",
    ],
    features_used: ["Mobile invoicing", "PAYE payroll", "Sales tracking"],
    cta_label: "See beauty workflow",
    cta_href: "/features/beauty",
    try_setup_href: "/features?stack=beauty_chair",
    tags: ["beauty", "paye", "invoicing", "guyana"],
    published_at: "2024-05-10",
    consent_obtained: true,
    anonymized: false,
  },
  {
    id: "story_logistics_devon_bartica",
    slug: "devon-logistics-bartica",
    title: "Jobs flowing into the books",
    persona: { name: "Devon", role: "Transport Owner", location: "Bartica Road" },
    image_src: "/photos/landing/logistics-1024x640.webp",
    teaser: "How Devon uses quotes and delivery receipts to keep VAT in the flow.",
    summary_lines: [
      "Converted quotes to delivery receipts with VAT applied.",
      "Tracked fuel and tolls per job via bank import rules.",
      "Saw job profitability before month-end.",
    ],
    features_used: ["Quotes→Invoices", "Delivery receipts", "Bank import & rules"],
    cta_label: "See logistics tools",
    cta_href: "/features/logistics",
    try_setup_href: "/features?stack=logistics_flow",
    tags: ["logistics", "vat", "bank-import", "guyana"],
    published_at: "2024-05-20",
    consent_obtained: true,
    anonymized: false,
  },
  {
    id: "story_realestate_ayanna_alberttown",
    slug: "ayanna-real-estate-alberttown",
    title: "Rent rolls and reports made simple",
    persona: { name: "Ayanna", role: "Property Manager", location: "Alberttown" },
    image_src: "/photos/landing/real-estate-1024x640.webp",
    image_alt: "Property manager reviewing rent roll reports",
    teaser: "Automated rent and owner statements—month-end without manual math.",
    summary_lines: [
      "Automated recurring invoices for monthly rent and utilities.",
      "Kept deposits and receipts organized for audits.",
      "Ran clean owner statements without manual math.",
      "“Tenants happier; month-end calmer.”",
    ],
    features_used: ["Recurring invoices", "Deposits", "Receipts", "Owner statements"],
    cta_label: "See real-estate tools",
    cta_href: "/features/real-estate",
    try_setup_href: "/features?stack=realestate_recurring",
    tags: ["real-estate", "recurring", "receipts", "reports", "guyana"],
    published_at: null,
    consent_obtained: false,
    anonymized: false,
  },
  {
    id: "story_schoolboard_marcus_newamsterdam",
    slug: "marcus-school-board-new-amsterdam",
    title: "Grant tracking with real transparency",
    persona: { name: "Marcus", role: "School Board Treasurer", location: "New Amsterdam" },
    image_src: "/photos/landing/school-board-1024x640.webp",
    image_alt: "Treasurer reviewing school grant allocations",
    teaser: "Grant tracking and audit prep without spreadsheet chaos.",
    summary_lines: [
      "Managed grants and fees with clear allocations.",
      "Streamlined audit prep using consistent categories and receipts.",
      "Published summary reports for board meetings in minutes.",
      "“Less paperwork, more accountability.”",
    ],
    features_used: ["Categories", "Receipts", "Reports", "Audit prep"],
    cta_label: "See education tools",
    cta_href: "/features/education",
    try_setup_href: "/features?stack=school_transparency",
    tags: ["schools", "education", "grants", "audit", "receipts", "reports", "guyana"],
    published_at: null,
    consent_obtained: false,
    anonymized: false,
  },
  {
    id: "story_dealership_ryan_georgetown",
    slug: "ryan-dealership-georgetown",
    title: "Every unit’s true cost—at a glance",
    persona: { name: "Ryan", role: "Dealer", location: "Georgetown" },
    image_src: "/photos/landing/dealership-1024x640.webp",
    image_alt: "Dealer reviewing unit costs and margins",
    teaser: "How Ryan uses per-unit COGS to price with confidence.",
    summary_lines: [
      "Tracked purchase, duty, and reconditioning on each unit for real margins.",
      "Switched quotes → invoices with VAT in one click—no double entry.",
      "Consolidated multi-location sales and stock without spreadsheet chaos.",
    ],
    features_used: [
      "Inventory/COGS (per-unit)",
      "Quotes→Invoices",
      "VAT invoicing",
      "Multi-location",
      "P&L by location",
    ],
    cta_label: "See dealership tools",
    cta_href: "/features/dealership",
    try_setup_href: "/features?stack=dealership_pro",
    tags: ["dealership", "inventory", "vat", "cogs", "guyana"],
    published_at: null,
    consent_obtained: false,
    anonymized: false,
  },
  {
    id: "story_construction_keisha_linden",
    slug: "keisha-construction-linden",
    title: "Jobs on schedule, books in sync",
    persona: { name: "Keisha", role: "Contractor", location: "Linden" },
    image_src: "/photos/landing/construction-1024x640.webp",
    image_alt: "Contractor on site checking project costs and billing",
    teaser: "How Keisha uses job tracking and progress billing to stay on schedule.",
    summary_lines: [
      "Used projects/jobs to group quotes, invoices, and expenses per site.",
      "Adopted progress billing and kept VAT straight across stages.",
      "Reconciled fuel, materials, sub-contractors via bank import and rules.",
    ],
    features_used: [
      "Projects/Jobs",
      "Quotes→Invoices",
      "Progress billing",
      "VAT",
      "Bank import & rules",
      "Job profitability",
    ],
    cta_label: "See construction workflow",
    cta_href: "/features/construction",
    try_setup_href: "/features?stack=construction_jobs",
    tags: ["construction", "projects", "vat", "bank-import", "guyana"],
    published_at: null,
    consent_obtained: false,
    anonymized: false,
  },
];

export function getStoryBySlug(slug: string) {
  return stories.find((s) => s.slug === slug);
}

export function getStoryById(id: string) {
  return stories.find((s) => s.id === id);
}
