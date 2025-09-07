// heroBooks brand tokens — used by marketing pages (About/Contact) and general theming.
// These are neutral, easy-to-theme tokens matching the emerald/teal palette from the heroBooks logo.
export const colors = {
  // Core brand emerald
  primary: "#10B981",
  primaryLight: "#CFFAE6",
  primaryLighter: "#EDFCF6",
  primarySoftFrom: "#E6FAF2",
  primarySoftTo: "#F6FFFB",
  primaryTagBg: "#E6FBF3",
  primaryTagText: "#0C8A66",
  // Gradient header tones (cool neutrals to keep content legible)
  brandBlue: "#0f766e",
  brandBlueDark: "#115e59",
  brandBlueDarker: "#134e4a",
  gold: "#F2A300", // optional accent
};

export const fonts = {
  sans: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  serif: "'Merriweather', Georgia, Cambria, 'Times New Roman', Times, serif",
};

export type BrandVars = Record<string, string>;
export function asCssVars(): BrandVars {
  return {
    "--brand": colors.primary,
    "--brand-light": colors.primaryLight,
    "--brand-lighter": colors.primaryLighter,
    "--brand-soft-from": colors.primarySoftFrom,
    "--brand-soft-to": colors.primarySoftTo,
    "--brand-tag-bg": colors.primaryTagBg,
    "--brand-tag-text": colors.primaryTagText,
  };
}

