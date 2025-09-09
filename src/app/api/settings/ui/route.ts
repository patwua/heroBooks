import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { loadModules } from "@/lib/modules"

type UiSettings = { theme: string; modules: string[] }

function envSettings(): UiSettings {
  const { theme, enabled } = loadModules()
  return { theme, modules: Array.from(enabled) }
}

export async function GET() {
  // Try cookie override first (per-org/per-device), else env fallback
  try {
    const jar = cookies()
    const raw = jar.get("hb_ui")
    if (raw?.value) {
      const parsed = JSON.parse(raw.value) as UiSettings
      if (parsed?.theme && Array.isArray(parsed.modules)) {
        return NextResponse.json(parsed)
      }
    }
  } catch {}
  return NextResponse.json(envSettings())
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Partial<UiSettings>))
  const theme = body?.theme || envSettings().theme
  const modules = Array.isArray(body?.modules) ? body.modules : envSettings().modules

  // Persist lightweight override in a cookie (DB-agnostic).
  const jar = cookies()
  jar.set("hb_ui", JSON.stringify({ theme, modules }), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return NextResponse.json({ theme, modules })
}

