export const heroCopy = {
  construction: {
    headline: "Built for builders",
    story:
      "Quote, track, and bill jobs without wrestling spreadsheets. From materials to crews, keep every dollar and GRA-ready invoice in view.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See how it works", href: "/features" },
    },
  },
  salon: {
    headline: "Beauty in your books",
    story:
      "From walk-ins to payroll, keep receipts tidy and PAYE handled. Close your day with confidence—and clean reports.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features" },
    },
  },
  barbershop: {
    headline: "Sharp fades. Sharper books.",
    story:
      "Cash or card, every cut gets counted. Quick invoices, NIS-aware payroll, and end-of-month that takes minutes.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features" },
    },
  },
  logistics: {
    headline: "Move cargo, not spreadsheets",
    story:
      "Price lanes, issue delivery receipts, and reconcile fuel and fees—faster. One dashboard for quotes, jobs, and VAT.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See how it works", href: "/features" },
    },
  },
  dealership: {
    headline: "Sell cars, not chaos",
    story:
      "Track each unit’s costs—purchase, duty, reconditioning—and bill with VAT in one click. A dealer-friendly DMS without the bloat.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features/dealership" },
    },
  },
  accounting: {
    headline: "Guyana-ready accounting",
    story:
      "Local tax codes baked in: VAT, PAYE, NIS. Generate clean reports that match how you actually operate.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "View reports", href: "/features/reports" },
    },
  },
  "real-estate": {
    headline: "Property income, organized",
    story:
      "Automate recurring bills, track deposits, and keep owner reports crystal clear. Tenants happy, books happy.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features/real-estate" },
    },
  },
  "school-board": {
    headline: "Simple books for schools",
    story:
      "Manage grants, fees, and audits with transparent records. Turn month-end into a checklist—not a scramble.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features/education" },
    },
  },
  carwash: {
    headline: "Wash more, worry less",
    story:
      "Log daily sales, categorize expenses, and keep VAT straight. Your finances—tidy, timely, and in one place.",
    ctas: {
      primary: { label: "Get started", href: "/get-started" },
      secondary: { label: "See features", href: "/features" },
    },
  },
} as const;

export const testimonialCopy = {
  "shop-owner": {
    name: "Sasha",
    role: "Retail, Georgetown",
    quotes: [
      "We used to close late at month-end. With heroBooks, sales and VAT are always current—and I finally know my numbers without guessing.",
      "Bank imports reconcile in minutes. I spend less time stressing and more time serving customers.",
    ],
    since: "Since 2024",
  },
  "salon-owner": {
    name: "Maya",
    role: "Beauty, East Bank",
    quotes: [
      "Bookings, receipts, PAYE—everything in one place. I can send an invoice from my phone before the client leaves.",
      "Payroll used to scare me. Now it’s just part of closing the week.",
    ],
    since: "Since 2024",
  },
  "transport-owner": {
    name: "Devon",
    role: "Logistics, Bartica Road",
    quotes: [
      "From quotes to delivery receipts, we keep jobs moving and the books clean. Even fuel and tolls reconcile faster.",
      "Less spreadsheet chaos, more on-time runs—and reporting that actually mirrors the work.",
    ],
    since: "Since 2023",
  },
} as const;

export const bannerCopy = {
  invite: {
    headline: "Invite your accountant",
    body: "Share read-only access and get expert eyes on your books.",
    action: { label: "Send invite", href: "/dashboard/settings/team" },
  },
  bank: {
    headline: "Import your first bank file",
    body: "CSV or OFX—get transactions into heroBooks in minutes.",
    action: { label: "Import now", href: "/dashboard/import" },
  },
  invoice: {
    headline: "Bill a customer today",
    body: "Send a VAT-compliant invoice and track payment status.",
    action: { label: "New invoice", href: "/dashboard/invoices/new" },
  },
} as const;

export type HeroKey = keyof typeof heroCopy;
export type TestimonialKey = keyof typeof testimonialCopy;
export type BannerKey = keyof typeof bannerCopy;

