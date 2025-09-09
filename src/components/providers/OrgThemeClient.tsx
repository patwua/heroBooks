"use client"
import { useEffect } from "react"
import { useTheme } from "next-themes"

export default function OrgThemeClient() {
  const { setTheme } = useTheme()
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch("/api/settings/ui", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (active && data?.theme) setTheme(data.theme)
      } catch {}
    })()
    return () => {
      active = false
    }
  }, [setTheme])
  return null
}

