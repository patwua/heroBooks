import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function KbArticle({ params }: { params: { slug: string } }) {
  const file = findArticle(params.slug);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(escapeHtml(content));

  return (
    <Page title={data.title} subtitle={data.summary}>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SectionCard>
          {/* eslint-disable-next-line react/no-danger */}
          <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert"
               dangerouslySetInnerHTML={{ __html: String(html) }} />
        </SectionCard>
        <aside className="space-y-4">
          <SectionCard>
            <div className="text-sm text-muted-foreground">Last reviewed</div>
            <div className="text-base">{data.last_reviewed ?? "—"}</div>
            {Array.isArray(data.jurisdiction) && data.jurisdiction.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-muted-foreground">Jurisdiction</div>
                <div className="text-base">{data.jurisdiction.join(", ")}</div>
              </div>
            )}
          </SectionCard>
          {Array.isArray(data.sources) && data.sources.length > 0 && (
            <SectionCard>
              <div className="font-semibold">Sources</div>
              <ul className="mt-2 space-y-2 text-sm">
                {data.sources.map((s: any, i: number) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {s.title}
                    </a>
                    {s.publisher ? <span className="text-muted-foreground"> — {s.publisher}</span> : null}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
          <SectionCard>
            <div className="font-semibold">Try it in the app</div>
            <div className="text-sm text-muted-foreground mt-1">
              Open the demo to practice this workflow in heroBooks.
            </div>
            <a href="/continue-demo" className="mt-3 inline-flex items-center rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90">
              Open demo
            </a>
          </SectionCard>
        </aside>
      </div>
    </Page>
  );
}

function escapeHtml(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function findArticle(slug: string) {
  const dir = path.join(process.cwd(), "kb", "articles");
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data } = matter(raw);
    if (data.slug === slug) return path.join(dir, f);
  }
  throw new Error(`KB article not found: ${slug}`);
}
