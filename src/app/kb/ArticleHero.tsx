"use client";
import Image from "next/image";
import { useMemo } from "react";
import { colors } from "@/lib/brand-tokens";

const phrases = [
  { h: "PoA for Guyana", s: "Learn it. Run it." },
  { h: "heroBooks Academy", s: "Your accounting guide for Guyana" },
  { h: "PoA Hub", s: "From textbooks to transactions" },
  { h: "heroAccounting Library", s: "Empowering local businesses" },
  { h: "School of Accounting", s: "Guyana & Caribbean insights" },
];

export default function ArticleHero({ category }: { category?: string }) {
  const palettes: Record<string, [string, string]> = {
    "sales-vat": ["#0ea5e9", "#0369a1"],
    payroll: ["#16a34a", "#065f46"],
    banking: ["#2563eb", "#1e3a8a"],
    controls: ["#7c3aed", "#312e81"],
    cash: ["#14b8a6", "#0f766e"],
    bookkeeping: ["#4338ca", "#1e3a8a"],
    inventory: ["#f59e0b", "#b45309"],
    compliance: ["#f97316", "#7c2d12"],
  };
  const pick = useMemo(() => {
    const i = Math.floor(Math.random() * phrases.length);
    return phrases[i];
  }, []);
  const [c1, c2] = palettes[category || ""] || [colors.brandBlueDarker, colors.brandBlue];
  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        backgroundImage: `linear-gradient(45deg, ${c1}, ${c2})`,
      }}
    >
      <div className="p-6 sm:p-8 text-white">
        {category && (
          <div className="mb-1 text-xs uppercase tracking-wide opacity-90">{category}</div>
        )}
        <div className="text-2xl font-extrabold leading-tight">{pick.h}</div>
        <div className="opacity-90 mt-1">{pick.s}</div>
      </div>
      <div className="absolute right-4 bottom-4 opacity-90">
        <Image src="/logos/heroBooks%20mini%20Color.webp" alt="heroBooks" width={48} height={48} className="h-12 w-12" />
      </div>
    </div>
  );
}
