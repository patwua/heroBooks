import { NextResponse } from "next/server";
import { getActiveOrgId, getFeatureStatus } from "@/lib/features";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const f = url.searchParams.get("f") as any;
  const orgId = await getActiveOrgId();
  const status = await getFeatureStatus(f, orgId);
  return NextResponse.json({ ok: true, data: status });
}
