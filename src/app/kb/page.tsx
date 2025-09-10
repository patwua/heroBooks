import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import SectionCard from "@/components/UX/SectionCard";
import taxonomy from "@/../kb/taxonomy.json";
import TipsBlock from "./TipsBlock";
import dynamic from "next/dynamic";
const FaqList = dynamic(() => import("./FaqList"), { ssr: false });
const RecentBlock = dynamic(() => import("./RecentBlock"), { ssr: false });

export default async function KbHome({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const cats = (taxonomy as any).categories ?? [];
  const params = (await (searchParams || Promise.resolve({}))) as any;
  const cat = typeof params.cat === 'string' ? params.cat : undefined;

  // Load published articles from search index
  let articles: Array<{ slug: string; title: string; category_id?: string; summary?: string }> = [];
  try {
    const file = path.join(process.cwd(), "kb", "search_index.json");
    const raw = fs.readFileSync(file, "utf8");
    const idx = JSON.parse(raw) as any[];
    articles = idx.map((a: any) => ({ slug: a.slug, title: a.title, category_id: a.category_id, summary: a.summary }));
  } catch {}

  const inCat = (cat ? articles.filter((a) => a.category_id === cat) : []).slice(0, 24);
  // Load FAQs (snippets) for this page
  let faqs: Array<{ slug: string; q: string; a: string }> = [];
  try {
    const file = path.join(process.cwd(), "kb", "kb_assist_index.json");
    const raw = fs.readFileSync(file, "utf8");
    const idx = JSON.parse(raw).kb_snippets as any[];
    const seen = new Set<string>();
    for (const s of idx) {
      if (seen.has(s.q)) continue;
      seen.add(s.q);
      faqs.push({ slug: s.slug, q: s.question || s.q, a: s.answer || s.a });
      if (faqs.length >= 12) break;
    }
  } catch {}

  return (
      <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Press <kbd>/</kbd> to search this section.
          </div>
          <div className="flex gap-3">
            <Link href="/continue-demo" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-muted/40">Try the demo</Link>
            <Link href="/get-started" className="inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90">Start free</Link>
          </div>
        </div>
      </SectionCard>
      {!cat && (
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="mb-2 text-lg font-semibold">Browse by section</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c: any) => (
              <Link
                key={c.id}
                href={`/kb?cat=${c.id}`}
                className="group rounded-2xl border bg-card p-4 hover:shadow-md transition"
              >
                <div className="text-lg font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground mt-1">Open this section</div>
                <div className="mt-3 aspect-square rounded-xl bg-muted group-hover:bg-muted/70" />
              </Link>
            ))}
          </div>
        </SectionCard>
      )}
      {cat ? (
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="mb-3 text-sm text-muted-foreground">{inCat.length} article(s) in this category</div>
          <div className="grid gap-3">
            {inCat.map((a) => (
              <Link
                key={a.slug}
                href={`/kb/${a.slug}`}
                className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="font-medium">{a.title}</div>
                {a.summary && <div className="text-sm text-muted-foreground line-clamp-2">{a.summary}</div>}
              </Link>
            ))}
            {inCat.length === 0 && (
              <div className="text-sm text-muted-foreground">No published articles yet. Check back soon.</div>
            )}
          </div>
        </SectionCard>
      ) : (
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="mb-2 text-lg font-semibold">Tips for you</div>
          <TipsBlock />
        </SectionCard>
      )}
      {!cat && (
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="mb-2 text-lg font-semibold">Pick up where you left off</div>
          <RecentBlock />
        </SectionCard>
      )}
      {!cat && (
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="mb-2 text-lg font-semibold">Frequently Asked Questions</div>
          <FaqList items={faqs} />
        </SectionCard>
      )}
  );
}


