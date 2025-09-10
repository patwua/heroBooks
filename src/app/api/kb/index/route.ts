import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  try {
    const file = path.join(process.cwd(), "kb", "search_index.json");
    const raw = fs.readFileSync(file, "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch (e) {
    return NextResponse.json([]);
  }
}

