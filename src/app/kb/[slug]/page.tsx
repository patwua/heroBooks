import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import taxonomy from "@/../kb/taxonomy.json";
import SectionCard from "@/components/UX/SectionCard";
import GlossaryTips from "@/components/kb/GlossaryTips";
import Image from "next/image";
import { notFound } from "next/navigation";
import ViewBeacon from "../ViewBeacon";
import ArticleHero from "../ArticleHero";
import DismissTopic from "../DismissTopic";

export default async function KbArticlePage({ params }: {params: Promise<{slug: string;}>;}) {
  const { slug } = await params;
  let file: string | undefined;
  try {
    file = await findArticle(slug);
  } catch {
    notFound();
  }
  if (!file) notFound();

  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch {
    notFound();
  }

  const { data, content } = matter(raw);
  const pre = preprocessFigures(content || "");
  const html = marked.parse(pre);
  const safeHtml = sanitizeHtml(String(html), {
    allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th"],

    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: [
      "src",
      "alt",
      "title",
      "width",
      "height",
      "srcset",
      "sizes",
      "loading",
      "decoding"],

      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"]
    },
    // allow relative links like /kb/illustrations/... and protocol-relative URLs
    allowProtocolRelative: true
  });
  const readingMinutes = Math.max(1, Math.round((content || "").split(/\s+/).length / 200));

  async function findArticle(slug: string): Promise<string> {
    const file = await resolveArticlePath(slug);
    if (!file) throw new Error(`KB article not found: ${slug}`);
    return file;
  }

  const metaLine = buildMetaLine2(data, readingMinutes);
  const catId = (data as any)?.category_id as string | undefined;
  const cat = ((taxonomy as any).categories || []).find((c: any) => c.id === catId);
  const titleClean = fixMojibakeText(String(data.title || ""));

  return (
    <div className="space-y-6">
      <ViewBeacon slug={data.slug} />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold flex-1">{titleClean}</h1>
          <DismissTopic slug={data.slug} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">{metaLine}</div>
          {(cat ?
          <span className="inline-block rounded-full px-2 py-0.5 text-xs" style={{ background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.3)" }}>
              {cat.name}
            </span> : null)}
          
        </div>
      </div>
      {data.illustration ?
      <div className="rounded-2xl overflow-hidden border">
          <Image src={String(data.illustration)} alt={titleClean} width={1200} height={630} className="w-full h-auto" />
        </div> :

      <ArticleHero category={data.category_id} />
      }

      <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent p-0">
        <GlossaryTips html={String(safeHtml)} />
      </SectionCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
          <div className="text-sm text-muted-foreground">Last reviewed</div>
          <div className="text-base">{data.last_reviewed ?? "-"}</div>
          {(Array.isArray(data.jurisdiction) && data.jurisdiction.length > 0 ?
          <div className="mt-3">
              <div className="text-sm text-muted-foreground">Jurisdiction</div>
              <div className="text-base">{data.jurisdiction.join(", ")}</div>
            </div> : null)}
          
        </SectionCard>
        {(Array.isArray(data.sources) && data.sources.length > 0 ?
        <SectionCard className="border-0 shadow-none bg-transparent dark:bg-transparent">
            <div className="font-semibold">Sources</div>
            <ul className="mt-2 space-y-2 text-sm">
              {data.sources.map((s: any, i: number) =>
            <li key={i}>
                  <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer">
                
                    {s.title}
                  </a>
                  {s.publisher ?
              <span className="text-muted-foreground"> — {s.publisher}</span> :
              null}
                </li>
            )}
            </ul>
          </SectionCard> : null)}
        
      </div>
    </div>);

}

// Simple in-memory cache of slug -> file path to avoid scanning on each request.
const ARTICLES_DIR = path.join(process.cwd(), "kb", "articles");
let articleIndexCache: Map<string, string> | null = null;

async function buildArticleIndex(): Promise<Map<string, string>> {
  const index = new Map<string, string>();
  let files: string[] = [];
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    // If the folder does not exist, return empty index
    return index;
  }
  await Promise.all(
    files.map(async (f) => {
      if (!f.endsWith(".md")) return;
      const full = path.join(ARTICLES_DIR, f);
      try {
        const raw = await fs.readFile(full, "utf8");
        const { data } = matter(raw);
        if (data?.slug) index.set(String(data.slug), full);
      } catch {

        // Ignore individual file errors
      }})
  );
  return index;
}

async function resolveArticlePath(slug: string): Promise<string | undefined> {
  if (!articleIndexCache) {
    articleIndexCache = await buildArticleIndex();
  }
  let file = articleIndexCache.get(slug);
  if (file) return file;
  // In case cache is stale (new article added), rebuild once
  articleIndexCache = await buildArticleIndex();
  file = articleIndexCache.get(slug);
  return file;
}

function buildMetaLine2(data: any, mins: number) {
  const src = Array.isArray(data.sources) && data.sources.length
    ? domainFromUrl(data.sources[0].url) || data.sources[0].publisher || data.sources[0].title
    : undefined;
  const when = data.last_reviewed
    ? new Date(String(data.last_reviewed)).toLocaleString(undefined, { month: "short", year: "numeric" })
    : undefined;
  const parts: string[] = [];
  if (src) parts.push(`Source @ ${src}`);
  parts.push(`${mins} min read`);
  if (when) parts.push(when);
  return parts.join(" • ");
}

function fixMojibakeText(s: string) {
  if (!s) return s;
  let out = s;
  // Replace common replacement-char artifacts with intended punctuation
  out = out.replace(/\uFFFD\+/g, "→");        // �+  => arrow
  out = out.replace(/\uFFFD['"]/g, " — ");    // �" or �' => em dash with spaces
  out = out.replace(/\uFFFD[-–—]/g, "—");      // �- or �– => em dash
  out = out.replace(/\uFFFD/g, "");            // drop any remaining unknowns
  // Fix odd sequences like "+'" left from arrow replacements
  out = out.replace(/\+'|\+’/g, "→");
  // Collapse whitespace
  out = out.replace(/\s{2,}/g, " ").trim();
  return out;
}

// HTML is sanitized via sanitize-html after marked.parse

function preprocessFigures(md: string) {
  // Enhance authoring shortcuts to proper markdown links/images while
  // avoiding code fences.
  const codeFence = /```[\s\S]*?```/g;
  let last = 0;
  const parts: string[] = [];

  function processSegment(s: string) {
    const lines = s.split(/\r?\n/);

    const rxFigure = /^>\s*Figure:\s*see\s+([^\s\)]+).*$/i;
    const rxVisual = /^(?:.*?)(?:SVG|Image|Visual)\s*:\s*(\/public\/kb\/illustrations\/[^\s\)]+|\/kb\/illustrations\/[^\s\)]+)\s*(?:\(alt:\s*"([^"]+)"\))?.*$/i;

    const out = lines.map((ln) => {
      const t = ln.trim();
      // Pattern 1: blockquote Figure syntax
      let m = rxFigure.exec(t);
      if (m) {
        let url = m[1].replace(/^\/public\//, "/");
        if (!/^\/(kb|logos)\//.test(url)) url = "/" + url.replace(/^\/+/, "");
        return `![Figure](${url})`;
      }
      // Pattern 2: Visual/Image/SVG line with optional alt
      m = rxVisual.exec(t);
      if (m) {
        let url = m[1].replace(/^\/public\//, "/");
        if (!/^\/(kb|logos)\//.test(url)) url = "/" + url.replace(/^\/+/, "");
        const alt = (m[2] || "Figure").trim();
        return `![${alt}](${url})`;
      }
      return ln;
    });

    let text = out.join("\n");

    // Inline transformations (outside fenced code):
    // - Article path: kb/articles/<slug>.md -> markdown link to /kb/<slug>
    text = text.replace(/\bkb\/articles\/([a-z0-9\-]+)\.md\b/gi, (_m, slug: string) => `[here](/kb/${slug})`);
    //   Also convert when wrapped in single backticks (inline code) by removing backticks
    text = text.replace(/`kb\/articles\/([a-z0-9\-]+)\.md`/gi, (_m, slug: string) => `[here](/kb/${slug})`);
    // - Templates: /kb/templates/<file>.csv -> markdown link
    text = text.replace(/(^|[^\]])(\/kb\/templates\/[\w\-/.]+\.(csv|txt|tsv|pdf|xlsx))/gi, (_m, pfx: string, path: string) => `${pfx}[${path}](${path})`);
    //   Also convert when wrapped in backticks
    text = text.replace(/`(\/kb\/templates\/[\w\-/.]+)`/gi, (_m, path: string) => `[${path}](${path})`);
    // - Raw illustration references: /public/kb/illustrations/*.svg -> image
    text = text.replace(/(^|\s)(\/public\/kb\/illustrations\/[\w\-/.]+\.svg)(?=\s|$)/gi, (_m, sp: string, url: string) => {
      const clean = url.replace(/^\/public\//, "/");
      return `${sp}![Figure](${clean})`;
    });
    // - Bare URLs: linkify http(s) and www.*
    text = text.replace(/(^|\s)(https?:\/\/[^\s<]+)(?=\s|$)/gi, (_m, sp: string, url: string) => `${sp}<${url}>`);
    text = text.replace(/(^|\s)(www\.[^\s<]+)(?=\s|$)/gi, (_m, sp: string, host: string) => `${sp}<http://${host}>`);

    return fixMojibakeText(text);
  }

  let m: RegExpExecArray | null;
  while ((m = codeFence.exec(md))) {
    const start = m.index;
    const end = start + m[0].length;
    if (start > last) parts.push(processSegment(md.slice(last, start)));
    // Keep code fence as-is
    parts.push(m[0]);
    last = end;
  }
  if (last < md.length) parts.push(processSegment(md.slice(last)));

  return parts.join("");
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
  const src = Array.isArray(data.sources) && data.sources.length ?
  domainFromUrl(data.sources[0].url) || data.sources[0].publisher || data.sources[0].title :
  undefined;
  const when = data.last_reviewed ?
  new Date(String(data.last_reviewed)).toLocaleString(undefined, { month: 'short', year: 'numeric' }) :
  undefined;
  const parts = [] as string[];
  if (src) parts.push(`Source @ ${src}`);
  parts.push(`${mins} min read`);
  if (when) parts.push(when);
  return parts.join(" • ");
}
