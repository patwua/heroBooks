export const heroCopy = {
  construction: {
    headline: "Built for builders",
    subhead: "Track jobs, invoices, and VAT with zero stress.",
    cta: { label: "Start a free setup", href: "/get-started" },
  },
  salon: {
    headline: "Cuts, color—clean books",
    subhead: "Stay on top of bookings, receipts, and PAYE.",
    cta: { label: "Try heroBooks", href: "/get-started" },
  },
  barbershop: {
    headline: "Sharp fades. Sharper books.",
    subhead: "Simple invoicing, NIS, and cash-flow clarity.",
    cta: { label: "Open your dashboard", href: "/get-started" },
  },
  logistics: {
    headline: "Move cargo, not spreadsheets",
    subhead: "Quotes, deliveries, and compliance—one dashboard.",
    cta: { label: "See how it works", href: "/get-started" },
  },
  dealership: {
    headline: "Sell cars, not chaos",
    subhead: "Inventory, COGS, invoices, and VAT built-in.",
    cta: { label: "Start a free setup", href: "/get-started" },
  },
  accounting: {
    headline: "Guyana-ready accounting",
    subhead: "VAT, PAYE, and NIS—done right for local rules.",
    cta: { label: "Get started", href: "/get-started" },
  },
  "real-estate": {
    headline: "Track rent the right way",
    subhead: "Receipts, deposits, and owner reports—no fuss.",
    cta: { label: "Try heroBooks", href: "/get-started" },
  },
  "school-board": {
    headline: "Simple books for schools",
    subhead: "Grants, fees, and audits made transparent.",
    cta: { label: "See how it works", href: "/get-started" },
  },
  carwash: {
    headline: "Wash more, worry less",
    subhead: "Daily sales, expenses, and VAT—tidy and clear.",
    cta: { label: "Open your dashboard", href: "/get-started" },
  },
} as const;

export const testimonialCopy = {
  "shop-owner": {
    name: "Sasha, Shop Owner",
    quote: "heroBooks keeps my sales and VAT tidy—I finally know where I stand.",
    role: "Retail — Georgetown",
  },
  "salon-owner": {
    name: "Maya, Salon Owner",
    quote: "I send invoices from my phone, and PAYE is no longer scary.",
    role: "Beauty — East Bank",
  },
  "transport-owner": {
    name: "Devon, Transport",
    quote: "From quotes to delivery receipts—it’s all in one dashboard.",
    role: "Logistics — Bartica Road",
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
