"use client"
import { useEffect, useState, useTransition } from "react"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ALL_MODULES: string[] = [
  "ui:nav:marketing",
  "ui:footer:default",
  "ui:hero:default",
  "ux:page",
  "ux:section-card",
  "promo:banner",
]
const THEMES = ["default", "christmas"]

export default function UiSettingsPanel() {
  const [loading, setLoading] = useState(true)
  const [theme, setThemeLocal] = useState<string>("default")
  const [modules, setModules] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const { setTheme } = useTheme()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/settings/ui", { cache: "no-store" })
        const json = await res.json()
        setThemeLocal(json.theme || "default")
        setModules(Array.isArray(json.modules) ? json.modules : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const toggle = (key: string) =>
    setModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    )

  const save = () =>
    startTransition(async () => {
      await fetch("/api/settings/ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, modules }),
      })
      setTheme(theme)
    })

  if (loading) return <div className="text-sm text-muted-foreground">Loading UI settings…</div>

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">UI Modules & Theme</h3>
        <p className="text-sm text-muted-foreground">
          Toggle marketing sections and switch themes without redeploying.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Active Theme</label>
          <div className="mt-2">
            <select
              className="border rounded-md px-3 py-2 bg-background"
              value={theme}
              onChange={(e) => setThemeLocal(e.target.value)}
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Enabled Modules</label>
          <div className="mt-2 grid sm:grid-cols-2 gap-3">
            {ALL_MODULES.map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={modules.includes(m)}
                  onChange={() => toggle(m)}
                />
                {m}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  )
}

