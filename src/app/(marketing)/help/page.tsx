import taxonomy from "@/../kb/taxonomy.json";
import fs from "node:fs";
import path from "node:path";
import FaqList from "../../kb/FaqList";

export const metadata = { title: "Help & FAQ - heroBooks" };

export default function HelpPage() {
  const ROOT = process.cwd();
  let faqs: Array<{ slug: string; q: string; a: string }> = [];
  try {
    const rawFaq = fs.readFileSync(path.join(ROOT, "kb", "kb_assist_index.json"), "utf8");
    const all = JSON.parse(rawFaq).kb_snippets as any[];
    const seen = new Set<string>();
    for (const s of all) {
      const q = s.question || s.q;
      if (!q || seen.has(q)) continue;
      seen.add(q);
      faqs.push({ slug: s.slug, q, a: s.answer || s.a });
      if (faqs.length >= 20) break;
    }
  } catch {}
  const cats = (taxonomy as any).categories ?? [];
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">Quick answers, guides, and workflows.</p>
      </header>
      <section className="border rounded-2xl p-6">
        <div className="mb-3 text-lg font-semibold">Browse sections</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c: any) => (
            <a key={c.id} href={`/kb?cat=${c.id}`} className="group rounded-2xl border bg-card p-4 hover:shadow-md transition">
              <div className="text-lg font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground mt-1">Open knowledge base</div>
              <div className="mt-3 aspect-square rounded-xl bg-muted group-hover:bg-muted/70" />
            </a>
          ))}
        </div>
      </section>
      <section className="mt-8 border rounded-2xl p-6">
        <h2 className="text-xl font-semibold">FAQs</h2>
        <div className="mt-4">
          <FaqList items={faqs} />
        </div>
      </section>
    </div>
  );
}
