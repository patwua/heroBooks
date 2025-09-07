"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const anchors = [
  { href: "/#features", label: "Features" },
  { href: "/#why-local", label: "Why Choose Local" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function SearchPage() {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim();
  const results = !q ? [] : anchors.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Search</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {q ? `Results for "${q}"` : "Type a query in the header to search sections."}
      </p>
      <div className="mt-6 grid gap-3">
        {q && results.length === 0 && (
          <p className="text-sm text-muted-foreground">No direct matches. Try different keywords.</p>
        )}
        {results.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
