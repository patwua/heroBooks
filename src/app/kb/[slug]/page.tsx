import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import taxonomy from "@/../kb/taxonomy.json";
import SectionCard from "@/components/UX/SectionCard";
import Image from "next/image";
import ViewBeacon from "../ViewBeacon";
import ArticleHero from "../ArticleHero";
import DismissTopic from "../DismissTopic";

export default function KbArticlePage({ params }: any) {
  const { slug } = params as { slug: string };
  const file = findArticle(slug);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const pre = preprocessFigures(content || "");
  const html = marked.parse(escapeHtml(pre));
  const readingMinutes = Math.max(1, Math.round(((content || "").split(/\s+/).length) / 200));

  function findArticle(slug: string): string {
    const dir = path.join(process.cwd(), "kb", "articles");
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data } = matter(raw);
      if (data.slug === slug) return path.join(dir, f);
    }
    throw new Error(`KB article not found: ${slug}`);
  }

  const metaLine = buildMetaLine(data, readingMinutes);
  const catId = (data as any)?.category_id as string | undefined;
  const cat = ((taxonomy as any).categories || []).find((c: any) => c.id === catId);

  return (
    <div className="space-y-6">
      <ViewBeacon slug={data.slug} />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold flex-1">{data.title}</h1>
          <DismissTopic slug={data.slug} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">{metaLine}</div>
          {cat && (
            <span className="inline-block rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.3)" }}>
              {cat.name}
            </span>
          )}
        </div>
      </div>
      {data.illustration ? (
        <div className="rounded-2xl overflow-hidden border">
          <Image src={String(data.illustration)} alt={data.title} width={1200} height={630} className="w-full h-auto" />
        </div>
      ) : (
        <ArticleHero category={data.category_id} />
      )}

      <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent p-0">
        {/* eslint-disable-next-line react/no-danger */}
        <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: String(html) }}
        />
      </SectionCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="text-sm text-muted-foreground">Last reviewed</div>
          <div className="text-base">{data.last_reviewed ?? "-"}</div>
          {Array.isArray(data.jurisdiction) && data.jurisdiction.length > 0 && (
            <div className="mt-3">
              <div className="text-sm text-muted-foreground">Jurisdiction</div>
              <div className="text-base">{data.jurisdiction.join(", ")}</div>
            </div>
          )}
        </SectionCard>
        {Array.isArray(data.sources) && data.sources.length > 0 && (
          <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
            <div className="font-semibold">Sources</div>
            <ul className="mt-2 space-y-2 text-sm">
              {data.sources.map((s: any, i: number) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.title}
                  </a>
                  {s.publisher ? (
                    <span className="text-muted-foreground"> — {s.publisher}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>
    </div>
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

function preprocessFigures(md: string) {
  // Convert lines like: "> Figure: see /public/kb/illustrations/file.svg (1:1)"
  // into markdown images pointing to /kb/illustrations/file.svg
  const lines = md.split(/\r?\n/);
  const rx = /^>\s*Figure:\s*see\s+([^\s\)]+).*$/i;
  const out = lines.map((ln) => {
    const m = rx.exec(ln.trim());
    if (!m) return ln;
    let url = m[1].replace(/^\/public\//, "/");
    // if points to /kb/illustrations/..., leave as is; otherwise fallback
    if (!/^\/(kb|logos)\//.test(url)) url = "/" + url.replace(/^\/+/, "");
    return `![Figure](${url})`;
  });
  return out.join("\n");
}

function domainFromUrl(u?: string) {
  if (!u) return undefined;
  try {
    const url = new URL(u);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function buildMetaLine(data: any, mins: number) {
  const src = Array.isArray(data.sources) && data.sources.length
    ? (domainFromUrl(data.sources[0].url) || data.sources[0].publisher || data.sources[0].title)
    : undefined;
  const when = data.last_reviewed
    ? new Date(String(data.last_reviewed)).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : undefined;
  const parts = [] as string[];
  if (src) parts.push(`Source @ ${src}`);
  parts.push(`${mins} min read`);
  if (when) parts.push(when);
  return parts.join(" • ");
}



