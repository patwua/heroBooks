"use client";
import { ReactNode } from "react";
import { colors } from "@/lib/brand-tokens";

export default function Page({ title, subtitle, children, compact = false }: { title: string; subtitle?: string; children: ReactNode; compact?: boolean }) {
  return (
    <div>
      <header
        className={compact ?
          "relative grid h-16 place-items-center overflow-hidden px-4 text-center text-white" :
          "relative grid min-h-[40vh] place-items-center overflow-hidden px-4 pt-16 text-center text-white"}
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})`,
        }}
      >
        <h1 className={compact ? "text-xl font-semibold" : "text-4xl font-extrabold"}>{title}</h1>
        {!compact && subtitle && <p className="mt-2 font-serif text-base opacity-95 md:text-lg">{subtitle}</p>}
      </header>
      <main className={compact ? "mx-auto my-6 max-w-5xl px-4" : "mx-auto -mt-12 mb-16 max-w-5xl px-4"}>{children}</main>
    </div>
  );
}

