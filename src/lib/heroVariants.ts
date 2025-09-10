import { cookies } from "next/headers";

export type HeroVariantKey = "general" | "dealers" | "services" | "logistics";

type HeroContent = {
  img: string;
  headline: string;
  subhead: string;
  alt: string;
};

const ALL_VARIANTS: readonly HeroVariantKey[] = [
  "general",
  "dealers",
  "services",
  "logistics",
] as const;

export const HERO_VARIANTS: Record<HeroVariantKey, HeroContent> = {
  general: {
    img: "/landing/accounting.webp",
    headline: "Simple, local‑first accounting for Guyana",
    subhead:
      "VAT‑ready invoices, PAYE/NIS schedules, and clean reports built around how you actually work.",
    alt: "Accounting screens in heroBooks",
  },
  dealers: {
    img: "/landing/dealership.webp",
    headline: "Know your true COGS on every unit",
    subhead:
      "Duty, reconditioning, and per‑unit costs tracked from purchase to sale — VAT and exports included.",
    alt: "Dealer lot — inventory tracking",
  },
  services: {
    img: "/landing/salon.webp",
    headline: "Bill faster and stay VAT‑clean",
    subhead:
      "Simple invoices, expenses, and PAYE/NIS — plus exports your accountant will love.",
    alt: "Salon — service workflows",
  },
  logistics: {
    img: "/landing/logistics.webp",
    headline: "Track jobs and costs with confidence",
    subhead:
      "Materials, labor, and trips in one place — see profit by job with VAT/NIS/PAYE handled.",
    alt: "Logistics — jobs and trips",
  },
};

function parsePool(): HeroVariantKey[] {
  const raw = process.env.LANDING_VARIANT_POOL;
  if (!raw) return [...ALL_VARIANTS];
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as HeroVariantKey[];
  const valid = parts.filter((p) => (ALL_VARIANTS as readonly string[]).includes(p));
  return valid.length ? valid : [...ALL_VARIANTS];
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function resolveHeroVariant(): Promise<{ key: HeroVariantKey; content: HeroContent }> {
  const enable = process.env.LANDING_RANDOMIZE === "1";
  const pool = parsePool();
  const jar = cookies();

  // Default (no randomization): general
  if (!enable) {
    return { key: "general", content: HERO_VARIANTS.general };
  }

  // Use cookie if present and valid
  const existing = jar.get("hb_hero")?.value as HeroVariantKey | undefined;
  const validExisting = existing && pool.includes(existing) ? existing : undefined;

  const selected: HeroVariantKey = validExisting ?? pickRandom(pool);

  // Persist selection for 1 hour (3600s) per request
  try {
    jar.set("hb_hero", selected, { path: "/", maxAge: 3600, sameSite: "lax" });
  } catch {}

  return { key: selected, content: HERO_VARIANTS[selected] };
}

