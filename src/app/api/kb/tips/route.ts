import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

export async function GET() {
  const ROOT = process.cwd();
  const file = path.join(ROOT, "kb", "search_index.json");
  try {
    const raw = fs.readFileSync(file, "utf8");
    const idx = JSON.parse(raw) as Array<{ slug: string; title: string; summary?: string; category_id?: string }>;
    const c = cookies();
    let counts: Record<string, number> = {};
    let dismissed: string[] = [];
    try { counts = JSON.parse(c.get("kb_view_counts")?.value || "{}"); } catch {}
    try { dismissed = JSON.parse(c.get("kb_tips_dismissed")?.value || "[]"); } catch {}
    // Optional org feature hints via cookie (if present). Example cookie value:
    // {"enableVAT":true,"enablePAYE":false,"enableNIS":true}
    let features: any = {};
    let recency: Record<string, number> = {};
    try { features = JSON.parse(c.get("hb_tax_features")?.value || "{}"); } catch {}
    try { recency = JSON.parse(c.get("kb_view_times")?.value || "{}"); } catch {}

    const ranked = idx
      .filter((a) => !dismissed.includes(a.slug))
      .map((a) => {
        let score = counts[a.slug] || 0;
        const t = (a.title || "").toLowerCase();
        const s = a.slug.toLowerCase();
        const cat = (a.category_id || "").toLowerCase();
        if (features?.enableVAT && (t.includes("vat") || s.includes("vat") || cat === "sales-vat")) score += 2;
        if ((features?.enablePAYE || features?.enableNIS) && (t.includes("paye") || t.includes("payroll") || s.includes("paye") || s.includes("payroll") || s.includes("nis") || cat === "payroll")) score += 2;
        // Recency boost: +3 if <1d, +2 if <7d, +1 if <30d
        const ts = recency[a.slug] || 0;
        if (ts) {
          const age = Date.now() - ts;
          const d = 24 * 60 * 60 * 1000;
          if (age < 1 * d) score += 3;
          else if (age < 7 * d) score += 2;
          else if (age < 30 * d) score += 1;
        }
        return { ...a, score };
      })
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 6)
      .map((a) => ({ slug: a.slug, title: a.title, summary: a.summary }));
    // Fallback if all dismissed or empty
    const results = ranked.length ? ranked : idx.slice(0, 6).map((a) => ({ slug: a.slug, title: a.title, summary: a.summary }));
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [] });
  }
}
