"use client";
import { useState } from "react";

export default function FaqList({ items }: { items: Array<{ slug: string; q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y rounded-2xl border">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={`${f.slug}-${i}`} className="p-0">
            <button
              className="w-full text-left px-4 py-3 hover:bg-muted/40"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <div className="font-medium">{f.q}</div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-muted-foreground">
                {f.a}
                <div className="mt-2">
                  <a href={`/kb/${f.slug}`} className="underline">Read the full guide</a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

