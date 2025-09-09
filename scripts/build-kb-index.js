/* Build KB indexes + guard against placeholder content
   Usage:
     pnpm run kb:build           # builds indexes
     pnpm run kb:check           # same, but CI guard
*/
const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");
const { marked } = require("marked");

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "kb", "articles");
const search = [];
const assist = [];

// Gather all placeholder offenders so authors can fix them in one pass.
const offenders = [];

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
  /Next actions: Follow the step-by-step/i
];

for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith(".md")) continue;
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const { data, content } = matter(raw);

  // Placeholder guard
  if (BAD_PHRASES.some((rx) => rx.test(content))) {
    offenders.push(file);
    continue; // skip indexing placeholders
  }

  const html = marked.parse(content);
  search.push({
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    category_id: data.category_id,
    tags: data.tags ?? [],
    last_reviewed: data.last_reviewed,
    html_excerpt: String(html).replace(/<[^>]+>/g, " ").slice(0, 1000)
  });
  for (const s of data.kb_snippets ?? []) {
    assist.push({
      id: data.id,
      slug: data.slug,
      intent: s.type,
      q: s.question,
      a: s.answer
    });
  }
}

if (offenders.length) {
  console.error("❌ Placeholder text found in the following KB articles:");
  offenders.forEach((f) => console.error(" -", f));
  process.exit(1);
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
