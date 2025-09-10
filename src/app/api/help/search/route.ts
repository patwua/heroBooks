import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ results: [] });
  const ROOT = process.cwd();
  const file = path.join(ROOT, "kb", "kb_assist_index.json");
  try {
    const raw = fs.readFileSync(file, "utf8");
    const idx = (JSON.parse(raw).kb_snippets || []) as Array<{
      id: string;
      slug: string;
      intent: string;
      q: string;
      a: string;
    }>;
    const Q = q.toLowerCase();
    const results = idx
      .filter((r) => r.q.toLowerCase().includes(Q) || r.a.toLowerCase().includes(Q))
      .slice(0, 20)
      .map((r) => ({ slug: r.slug, title: r.q, summary: r.a.slice(0, 160) }));
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [], error: "assist_index_missing" }, { status: 200 });
  }
}

