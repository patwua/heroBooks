"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Note: next-themes supports any string (not just light/dark). We use 'data-theme'.
// The actual palette comes from CSS variables in global.css (Tailwind v4 theme vars).

const DEFAULT_THEME = process.env.NEXT_PUBLIC_THEME_ACTIVE || process.env.THEME_ACTIVE || "default"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
