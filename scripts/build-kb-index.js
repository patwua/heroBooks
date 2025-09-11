/* Build KB indexes + guard against placeholder content with a draft gate
   Usage:
     pnpm run kb:build    # builds indexes
     pnpm run kb:check    # same, but CI guard
*/
const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "kb", "articles");
const search = [];
const assist = [];

// Placeholder tracking
const offenders = [];
const drafted = [];

// Tightly scoped phrases used in stubs; keep list short to avoid false positives.
const BAD_PHRASES = [
  /This is a placeholder/i,
  /Discuss the foundational principles/i,
  /Provide current rates/i,
  /Outline practical steps/i,
  /Include a practical example/i,
  /Highlight typical mistakes/i,
  /Define important terms/i,
  /List the sources cited/i,
  /Next actions: Read this article/i, // older template text
  /Next actions: Follow the step-by-step/i,
];

for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith(".md")) continue;
  const full = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);

  // Content normalization for nicer rendering (links/images)
  let normalized = String(content || "");
  try {
    // 1) Replace Square SVG lines with embedded markdown images
    // Square SVG: `.../kb/illustrations/foo.svg` (alt: "...optional...")
    normalized = normalized.replace(/Square SVG:\s*`([^`]+)`\s*(?:\(alt:\s*[“"]?([^”")]+)[”"]?\)\.)?/g, (_, p1, p2) => {
      let path = p1.replace(/^\/public/, "");
      if (!/^\//.test(path)) path = "/" + path;
      // Ensure /kb prefix for illustrations
      path = path.replace(/^\/kb\/illustrations\//, "/kb/illustrations/");
      path = path.replace(/^\/public\/kb\/illustrations\//, "/kb/illustrations/");
      const alt = p2 ? p2 : "Illustration";
      return `![${alt}](${path})`;
    });

    // 2) Make downloads clickable: Download: `/kb/templates/...`
    normalized = normalized.replace(/Download:\s+`(\/kb\/templates\/[^`]+)`/g, (m, p1) => {
      return `Download: [click here](${p1})`;
    });

    // 3) Make article references clickable: `kb/articles/slug.md` -> [click here](/kb/slug)
    normalized = normalized.replace(/`kb\/articles\/([a-z0-9\-]+)\.md`/gi, (m, slug) => {
      return `[click here](/kb/${slug})`;
    });

    // 4) Normalize illustration paths inside code or text: /public/kb/illustrations -> /kb/illustrations
    normalized = normalized.replace(/\/public\/kb\/illustrations\//g, "/kb/illustrations/");
  } catch (_) {}

  const isDraft = Boolean(data && (data.status === "draft" || data.draft === true));
  const hasPlaceholder = BAD_PHRASES.some((rx) => rx.test(content || ""));

  // Placeholder guard with draft gate
  if (hasPlaceholder) {
    if (isDraft) drafted.push(file);
    else offenders.push(file);
    continue; // skip indexing placeholders
  }

  // Skip indexing drafts even if they don't have placeholders
  if (isDraft) continue;

  const html = marked.parse(normalized);
  search.push({
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    category_id: data.category_id,
    tags: data.tags ?? [],
    last_reviewed: data.last_reviewed,
    html_excerpt: String(html).replace(/<[^>]+>/g, " ").slice(0, 1000),
  });
  for (const s of data.kb_snippets ?? []) {
    assist.push({
      id: data.id,
      slug: data.slug,
      intent: s.type,
      q: s.question,
      a: s.answer,
    });
  }
}

if (offenders.length || (process.env.KB_STRICT === "1" && drafted.length)) {
  console.error("❌ Placeholder text found in the following KB articles:");
  offenders.forEach((f) => console.error(" -", f));
  if (process.env.KB_STRICT === "1" && drafted.length) {
    console.error("\nDrafts containing placeholders (strict mode):");
    drafted.forEach((f) => console.error(" -", f));
  }
  process.exit(1);
}

if (drafted.length) {
  console.log("ℹ️ Draft articles with placeholders (not failing):");
  drafted.forEach((f) => console.log(" -", f));
}

fs.writeFileSync(
  path.join(ROOT, "kb", "search_index.json"),
  JSON.stringify(search, null, 2)
);
fs.writeFileSync(
  path.join(ROOT, "kb", "kb_assist_index.json"),
  JSON.stringify({ kb_snippets: assist }, null, 2)
);
console.log("✅ KB indexes rebuilt:", { articles: search.length, snippets: assist.length });
