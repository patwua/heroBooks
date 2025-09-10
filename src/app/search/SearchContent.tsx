"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const anchors = [
  { href: "/#features", label: "Features" },
  { href: "/#why-local", label: "Why Choose Local" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function SearchContent() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim();
  const section = (params.get("section") || "marketing").toLowerCase();
  const [kbResults, setKbResults] = useState<any[]>([]);
  const [kbLoading, setKbLoading] = useState(false);
  const mkResults = useMemo(
    () => (!q ? [] : anchors.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))),
    [q]
  );

  useEffect(() => {
    if (!q) {
      setKbResults([]);
      return;
    }
    if (section === "kb") {
      setKbLoading(true);
      fetch(`/api/kb/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((j) => setKbResults(j.results || []))
        .catch(() => setKbResults([]))
        .finally(() => setKbLoading(false));
    } else if (section === "help") {
      setKbLoading(true);
      fetch(`/api/help/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((j) => setKbResults(j.results || []))
        .catch(() => setKbResults([]))
        .finally(() => setKbLoading(false));
    } else {
      setKbResults([]);
    }
  }, [section, q]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Search</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {q ? `Results for "${q}"` : "Type a query in the header to search."}
      </p>
      <div className="mt-6 grid gap-3">
        {section === "kb" || section === "help" ? (
          <>
            {kbLoading && (
              <p className="text-sm text-muted-foreground">Searching knowledge base…</p>
            )}
            {q && !kbLoading && kbResults.length === 0 && (
              <p className="text-sm text-muted-foreground">No matches. Try different keywords.</p>
            )}
            {kbResults.map((r) => (
              <Link
                key={r.slug}
                href={`/kb/${r.slug}`}
                className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{r.summary}</div>
              </Link>
            ))}
          </>
        ) : (
          <>
            {q && mkResults.length === 0 && (
              <p className="text-sm text-muted-foreground">No direct matches. Try different keywords.</p>
            )}
            {mkResults.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                {r.label}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
