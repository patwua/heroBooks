import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ results: [] });
  const ROOT = process.cwd();
  const file = path.join(ROOT, "kb", "search_index.json");
  try {
    const raw = fs.readFileSync(file, "utf8");
    const idx = JSON.parse(raw) as Array<{
      slug: string;
      title: string;
      summary?: string;
      html_excerpt?: string;
    }>;
    const Q = q.toLowerCase();
    const results = idx
      .filter((r) =>
        (r.title || "").toLowerCase().includes(Q) ||
        (r.summary || "").toLowerCase().includes(Q) ||
        (r.html_excerpt || "").toLowerCase().includes(Q)
      )
      .slice(0, 20);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json({ results: [], error: "index_missing" }, { status: 200 });
  }
}

