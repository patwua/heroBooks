export type ModuleKey =
  | 'ui:nav:marketing'
  | 'ui:nav:app'
  | 'ui:footer:default'
  | 'ui:hero:default'
  | 'ux:page'
  | 'ux:section-card'
  | 'promo:banner';

export type ThemeKey = 'default' | 'christmas';

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
