"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Works whether you pass props from callers or not.
// Defaults keep our data-theme approach for token switching.
const DEFAULT_THEME =
  process.env.NEXT_PUBLIC_THEME_ACTIVE || process.env.THEME_ACTIVE || "default"

type NextThemesProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = DEFAULT_THEME,
  enableSystem = false,
  disableTransitionOnChange = true,
  ...rest
}: NextThemesProps) {
  return (
    <NextThemesProvider
      attribute={attribute as any}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...rest}
    >
      {children}
    </NextThemesProvider>
  )
}
