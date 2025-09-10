"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { recordFeatureImpression } from "@/lib/telemetry";

export default function SearchExpand() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  // '/' opens search, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !open) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      {!open && (
        <button
          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Search"
          onClick={() => setOpen(true)}
        >
          <Search className="h-5 w-5" />
        </button>
      )}
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            recordFeatureImpression({ feature: "search", reason: "header_search", path: location.pathname });
            const section = pathname.startsWith('/kb') ? 'kb' : pathname.startsWith('/help') ? 'help' : undefined;
            const qs = new URLSearchParams({ q });
            if (section) qs.set('section', section);
            router.push(`/search?${qs.toString()}`);
            setOpen(false);
          }}
          className="flex items-center gap-2 rounded-xl border bg-white pl-2 pr-2 dark:bg-neutral-900 dark:border-neutral-700"
        >
          <Search className="h-4 w-4 opacity-70" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search heroBooks"
            className="w-56 bg-transparent py-2 text-sm outline-none md:w-72"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Esc
          </button>
        </form>
      )}
    </div>
  );
}
