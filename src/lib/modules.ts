export type ModuleKey =
  | 'ui:nav:marketing'
  | 'ui:nav:app'
  | 'ui:footer:default'
  | 'ui:footer:alt'
  | 'ui:hero:default'
  | 'ux:page'
  | 'ux:section-card'
  | 'promo:banner';

export type ThemeKey = 'default' | 'christmas' | 'carnival' | 'independence';

const DEFAULT_MODULES: Readonly<ModuleKey[]> = [
  'ui:nav:marketing',
  'ui:footer:default',
  'ui:hero:default',
  'ux:page',
  'ux:section-card',
];

function parseList(val?: string): string[] {
  return (val ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Build-time defaults (env). */
export function loadModules() {
  const envEnabled = parseList(process.env.MODULES_ENABLED) as ModuleKey[];
  const enabled = new Set<ModuleKey>([...DEFAULT_MODULES, ...envEnabled]);
  const theme = (process.env.THEME_ACTIVE as ThemeKey) || 'default';
  return { enabled, theme };
}

export function isEnabled(key: ModuleKey) {
  return loadModules().enabled.has(key);
}

export function activeTheme(): ThemeKey {
  return loadModules().theme;
}

/** Request-aware resolution (SSR): DB → cookie → env */
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function resolveUiForRequest() {
  // 1) DB: try orgSettings if enabled via UI_FROM_DB=1
  try { if (process.env.UI_FROM_DB === "1") {
    // We don't know your exact schema; access through 'any' and catch if the model/fields don't exist.
    // @ts-ignore - runtime guard
    if ((prisma as any).orgSettings) {
      // Try a single global row — adapt later to a dedicated SiteSettings if desired.
      // @ts-ignore
      const row = await (prisma as any).orgSettings.findFirst({
        where: { scope: "site" },
        select: { theme: true, modules: true },
      });
      if (row && Array.isArray(row.modules) && typeof row.theme === "string") {
        return { theme: row.theme as ThemeKey, modules: new Set<ModuleKey>(row.modules) };
      }
    }
  } } catch {}

  // 2) Cookie override (per-browser preview)
  try {
    const jar = await cookies();
    const raw = jar.get("hb_ui");
    if (raw?.value) {
      const parsed = JSON.parse(raw.value) as { theme?: string; modules?: string[] };
      if (parsed?.theme && Array.isArray(parsed.modules)) {
        return { theme: parsed.theme as ThemeKey, modules: new Set<ModuleKey>(parsed.modules as ModuleKey[]) };
      }
    }
  } catch {}

  // 3) Env defaults
  const env = loadModules();
  return { theme: env.theme, modules: env.enabled };
}

export function isModuleEnabled(mods: Set<ModuleKey>, key: ModuleKey) {
  return mods.has(key);
}
