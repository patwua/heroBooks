"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { colors } from "@/lib/brand-tokens";
import taxonomy from "@/../kb/taxonomy.json";

type Article = {
  slug: string;
  title: string;
  category_id?: string;
};

type RightRailLink = {
  name?: string;
  title?: string;
  link?: string;
  url?: string;
  question?: string;
  open_in_new_tab?: boolean;
};

type RightRail = {
  gra_links?: RightRailLink[];
  nis_links?: RightRailLink[];
  internal_promos?: RightRailLink[];
  popular_snippets?: RightRailLink[];
};

export default function KbShell({
  children,
  articles,
  rightRail,
}: {
  children: React.ReactNode;
  articles: Article[];
  rightRail: RightRail;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const cat = params?.get('cat') || undefined;
  const catName = useMemo(() => {
    if (!cat) return undefined;
    const cats = (taxonomy as any).categories || [];
    return (cats.find((c: any) => c.id === cat)?.name as string) || undefined;
  }, [cat]);
  const slugFromPath = useMemo(() => {
    const m = pathname.match(/^\/kb\/(.+)$/);
    return m ? m[1] : undefined;
  }, [pathname]);
  const [read, setRead] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kb_read_slugs");
      if (raw) setRead(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  useEffect(() => {
    if (!slugFromPath) return;
    setRead((prev) => {
      if (prev.has(slugFromPath)) return prev;
      const next = new Set(prev);
      next.add(slugFromPath);
      try {
        localStorage.setItem(
          "kb_read_slugs",
          JSON.stringify(Array.from(next))
        );
      } catch {}
      return next;
    });
  }, [slugFromPath]);
  const filtered = articles; // drafts filtered in layout

  const grouped = useMemo(() => {
    const map = new Map<string, Article[]>();
    for (const a of filtered) {
      const key = a.category_id || "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    // sort items in each group
    for (const [, arr] of map) arr.sort((x, y) => x.title.localeCompare(y.title));
    return Array.from(map.entries()).map(([key, items]) => ({
      id: key,
      name:
        (taxonomy as any).categories?.find((c: any) => c.id === key)?.name ||
        key,
      items,
    }));
  }, [filtered]);

  const [drawer, setDrawer] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  // Auto-expand active category when viewing a category or article; else leave default open state
  useEffect(() => {
    try {
      let activeCat: string | undefined = cat || undefined;
      if (!activeCat && slugFromPath) {
        const hit = articles.find((a) => a.slug === slugFromPath);
        activeCat = hit?.category_id;
      }
      if (activeCat) {
        const next: Record<string, boolean> = {};
        grouped.forEach((g) => { next[g.id] = g.id === activeCat; });
        setOpenGroups(next);
        // Soft scroll group into view
        const el = document.getElementById(`kb-group-${activeCat}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, slugFromPath]);

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
  const [g1, g2] = palettes[cat || ""] || [colors.brandBlue, colors.brandBlueDark];

  return (
    <div className="flex-1">
      {/* Full-width section banner across panes */}
      <div
        className="w-full text-white"
        style={{
          backgroundImage: `linear-gradient(to right, ${g1}, ${g2})`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-sm opacity-90">Knowledge Base{catName ? ` / ${catName}` : ""}</div>
          <h1 className="mt-1 text-3xl font-extrabold">{catName || "Learn it. Run it."}</h1>
          <p className="mt-1 text-sm md:text-base opacity-95">Guyana-ready guides with citations.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-8">
          {/* Left: Navigation + links (no borders) */}
          <aside className="hidden lg:block">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Browse</div>
            {grouped.map((g) => (
              <div key={g.id} id={`kb-group-${g.id}`} className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <Link href={`/kb?cat=${g.id}`} className="text-[13px] font-semibold text-foreground hover:underline">
                    {g.name}
                  </Link>
                  <button
                    className="text-xs text-muted-foreground hover:underline"
                    onClick={() => setOpenGroups((s) => ({ ...s, [g.id]: !s[g.id] }))}
                    aria-expanded={!!openGroups[g.id]}
                  >
                    {openGroups[g.id] ? 'Hide' : 'Show'}
                  </button>
                </div>
                {openGroups[g.id] !== false && (
                <ul className="space-y-2">
                  {g.items.map((article) => {
                    const isRead = read.has(article.slug);
                    return (
                      <li key={article.slug}>
                        <Link
                          href={`/kb/${article.slug}`}
                          onClick={() => {
                            try {
                              setRead((prev) => {
                                const next = new Set(prev);
                                next.add(article.slug);
                                localStorage.setItem(
                                  "kb_read_slugs",
                                  JSON.stringify(Array.from(next))
                                );
                                return next;
                              });
                            } catch {}
                          }}
                          className={`block text-sm hover:underline ${isRead ? "text-foreground" : "text-blue-600 font-medium"}`}
                        >
                          {article.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                )}
              </div>
            ))}

            {/* Quick Links */}
            {(rightRail.gra_links || rightRail.nis_links) && (
              <div className="mt-8 space-y-6">
                {rightRail.gra_links && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      GRA Links
                    </div>
                    <ul className="space-y-1 text-sm">
                      {rightRail.gra_links.map((l) => (
                        <li key={l.url}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {l.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {rightRail.nis_links && (
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      NIS Links
                    </div>
                    <ul className="space-y-1 text-sm">
                      {rightRail.nis_links.map((l) => (
                        <li key={l.url}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {l.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {rightRail.popular_snippets && (
              <div className="mt-8">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Popular
                </div>
                <ul className="space-y-1 text-sm">
                  {rightRail.popular_snippets.map((l) => (
                    <li key={l.link}>
                      <Link href={l.link ?? "#"} className="hover:underline">
                        {l.question}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="min-w-0">
            {/* Mobile browse toggle */}
            <div className="mb-4 lg:hidden">
              <button
                className="rounded-xl border px-3 py-2 text-sm"
                onClick={() => setDrawer(true)}
              >
                Browse articles
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-80 bg-background shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Browse</div>
              <button className="rounded-md px-2 py-1 text-sm border" onClick={() => setDrawer(false)}>Close</button>
            </div>
            {grouped.map((g) => (
              <div key={g.id} className="mb-5">
                <div className="mb-2 text-[13px] font-semibold text-foreground/80">{g.name}</div>
                <ul className="space-y-2">
                  {g.items.map((article) => (
                    <li key={article.slug}>
                      <Link href={`/kb/${article.slug}`} onClick={() => setDrawer(false)} className="block text-sm hover:underline">
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
