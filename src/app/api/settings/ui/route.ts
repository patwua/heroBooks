import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { loadModules } from "@/lib/modules"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type UiSettings = { theme: string; modules: string[] }

function envSettings(): UiSettings {
  const { theme, enabled } = loadModules()
  return { theme, modules: Array.from(enabled) }
}

export async function GET() {
  // 1) DB: if orgSettings exists with scope = "site"
  try {
    // @ts-ignore dynamic check
    if ((prisma as any).orgSettings) {
      // @ts-ignore
      const row = await (prisma as any).orgSettings.findFirst({
        where: { scope: "site" },
        select: { theme: true, modules: true },
      })
      if (row?.theme && Array.isArray(row?.modules)) {
        return NextResponse.json({ theme: row.theme, modules: row.modules, canEditPlatform: await isSystemAdmin() })
      }
    }
  } catch {}

  // 2) Cookie override (browser-scoped)
  try {
    const jar = await cookies()
    const raw = jar.get("hb_ui")
    if (raw?.value) {
      const parsed = JSON.parse(raw.value) as UiSettings
      if (parsed?.theme && Array.isArray(parsed.modules)) {
        return NextResponse.json({ ...parsed, canEditPlatform: await isSystemAdmin() })
      }
    }
  } catch {}
  // 3) Env fallback
  return NextResponse.json({ ...envSettings(), canEditPlatform: await isSystemAdmin() })
}

export async function POST(req: Request) {
  // platform-level changes are System Admin only
  if (!(await isSystemAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json().catch(() => ({} as Partial<UiSettings>))
  const theme = body?.theme || envSettings().theme
  const modules = Array.isArray(body?.modules) ? body.modules : envSettings().modules

  // Try DB upsert if model exists; otherwise also set cookie fallback
  let savedToDb = false
  try {
    // @ts-ignore
    if ((prisma as any).orgSettings) {
      // A single global "site" scope row
      // @ts-ignore
      await (prisma as any).orgSettings.upsert({
        where: { scope: "site" },
        create: { scope: "site", theme, modules },
        update: { theme, modules },
      })
      savedToDb = true
    }
  } catch {}

  if (!savedToDb) {
    const jar = await cookies()
    jar.set("hb_ui", JSON.stringify({ theme, modules }), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }
  return NextResponse.json({ theme, modules })
}

async function isSystemAdmin() {
  const session = await auth().catch(() => null)
  const adminList = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
  const email = (session?.user as any)?.email?.toLowerCase?.()
  return !!(email && adminList.includes(email))
}

