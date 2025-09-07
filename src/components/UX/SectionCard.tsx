"use client";
import { ReactNode } from "react";

export default function SectionCard({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`rounded-2xl border bg-white p-6 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 ${className}`}>
      {children}
    </section>
  );
}

