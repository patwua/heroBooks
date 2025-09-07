"use client";
import { ReactNode } from "react";
import { colors } from "@/lib/brand-tokens";

export default function Page({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <header
        className="relative grid min-h-[40vh] place-items-center overflow-hidden px-4 pt-16 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${colors.brandBlue}, ${colors.brandBlueDark}, ${colors.brandBlueDarker})`,
        }}
      >
        <h1 className="text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 font-serif text-base opacity-95 md:text-lg">{subtitle}</p>}
      </header>
      <main className="mx-auto -mt-12 mb-16 max-w-5xl px-4">{children}</main>
    </div>
  );
}

