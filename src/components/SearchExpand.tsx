"use client";
import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchExpand() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
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
            /* TODO: integrate search */
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
