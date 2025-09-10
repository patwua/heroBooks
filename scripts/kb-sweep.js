/**
 * kb-sweep: mark placeholder articles as draft so builds don't fail.
 * - Adds front-matter `status: draft` if placeholder text is detected.
 * - Does not delete or move files; authors can promote later by removing the flag.
 */
const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const KB_DIR = path.join(__dirname, "..", "kb", "articles");

const BAD_PHRASES = [
  /This is a placeholder/i,
  /Discuss the foundational principles/i,
  /Provide current rates/i,
  /Outline practical steps/i,
  /Include a practical example/i,
  /Highlight typical mistakes/i,
  /Define important terms/i,
  /List the sources cited/i,
  /Next actions: Read this article/i,
  /Next actions: Follow the step-by-step/i,
];

let changed = 0;
const touched = [];

for (const file of fs.readdirSync(KB_DIR)) {
  if (!file.endsWith(".md")) continue;
  const full = path.join(KB_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  const fm = matter(raw);
  const txt = fm.content || "";
  const hasPlaceholder = BAD_PHRASES.some((rx) => rx.test(txt));
  const isDraft = Boolean(
    fm.data && (fm.data.status === "draft" || fm.data.draft === true)
  );
  if (hasPlaceholder && !isDraft) {
    fm.data = { ...(fm.data || {}), status: "draft" };
    const out = matter.stringify(fm.content, fm.data);
    fs.writeFileSync(full, out, "utf8");
    changed++;
    touched.push(path.basename(file));
  }
}

if (changed) {
  console.log(`✅ Drafted ${changed} placeholder article(s):`);
  for (const f of touched) console.log(" -", f);
} else {
  console.log("✅ No published placeholders found. Nothing to change.");
}

