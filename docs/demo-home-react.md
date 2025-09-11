Demo: Knowledge Base Home (React)

This demo component reads `kb/home_layout.json` and `kb/rates/tax_rates.json` to render a welcoming home with hero, search box, quick chips, featured items, templates, and a simple rates widget. In production, you can swap in your richer `RatesWidget` and `GlossaryTips`.

Prereqs
- Any React app (Vite, CRA, Next). Ensure `/kb/home_layout.json` and `/kb/rates/tax_rates.json` are served statically (this repo already ships them under `/kb/...`).

Component
```jsx
import React, { useEffect, useMemo, useState } from 'react'

function cn(...xs) { return xs.filter(Boolean).join(' ') }

export default function DemoKbHome() {
  const [layout, setLayout] = useState(null)
  const [countries, setCountries] = useState([])
  const [code, setCode] = useState('GY')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('/kb/home_layout.json').then(r => r.json()).then(setLayout).catch(() => setLayout(null))
    fetch('/kb/rates/tax_rates.json').then(r => r.json()).then(d => setCountries(d.countries || [])).catch(() => setCountries([]))
  }, [])

  const sel = useMemo(() => {
    if (!countries.length) return null
    return countries.find(c => c.code === code) || countries[0]
  }, [countries, code])

  if (!layout) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      {/* Hero */}
      <section className="rounded-2xl border bg-card p-6 text-card-foreground">
        <h1 className="text-2xl sm:text-3xl font-bold">{layout.hero?.title}</h1>
        <p className="mt-1 text-muted-foreground">{layout.hero?.subtitle}</p>
        <div className="mt-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={layout.hero?.search_placeholder || 'Search'}
            className="w-full rounded-xl border bg-background px-4 py-3"
            aria-label="Search the knowledge base"
          />
          {/* Bind to your search using kb/search_index.json if desired */}
        </div>
      </section>

      {/* Quick chips */}
      {Array.isArray(layout.quick_chips) && layout.quick_chips.length > 0 && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="mb-2 font-semibold">Quick chips</div>
          <div className="flex flex-wrap gap-2">
            {layout.quick_chips.map((c) => (
              <a key={c.slug} href={`/kb/${c.slug}`} className="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-muted/50">{c.label}</a>
            ))}
          </div>
        </section>
      )}

      {/* Featured articles */}
      {Array.isArray(layout.featured_articles) && layout.featured_articles.length > 0 && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="mb-2 font-semibold">Featured articles</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {layout.featured_articles.map((slug) => (
              <a key={slug} href={`/kb/${slug}`} className="rounded-xl border p-4 hover:bg-muted/40">
                <div className="font-medium">{slug}</div>
                <div className="text-sm text-muted-foreground">Open article</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Templates */}
      {Array.isArray(layout.featured_templates) && layout.featured_templates.length > 0 && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="mb-2 font-semibold">Templates</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {layout.featured_templates.map((t) => (
              <a key={t.path} href={t.path} className="rounded-xl border p-4 hover:bg-muted/40">
                <div className="font-medium">{t.label}</div>
                <div className="text-sm text-muted-foreground">Download</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Rates (basic demo). In prod, swap for <RatesWidget /> */}
      {layout?.widgets?.show_rates && countries.length > 0 && sel && (
        <section className="rounded-2xl border bg-card p-6">
          <div className="mb-2 font-semibold">VAT/GCT/GST standard rates</div>
          <div className="flex items-center gap-3">
            <label htmlFor="demo-rates" className="text-sm text-muted-foreground">Country</label>
            <select id="demo-rates" className="rounded-md border bg-background px-2 py-1 text-sm" value={code} onChange={e => setCode(e.target.value)}>
              {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div className="mt-3 rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">{sel.tax_name}</div>
            <div className="mt-1 text-lg font-semibold">Standard rate: {sel.standard_rate == null ? '—' : `${sel.standard_rate}%`}</div>
            {sel.verify_url && <a className="mt-2 inline-flex text-primary hover:underline" href={sel.verify_url} target="_blank" rel="noreferrer">Verify at authority</a>}
            <div className="mt-1 text-xs text-muted-foreground">Rates change — verify before use.</div>
          </div>
        </section>
      )}
    </div>
  )
}
```

Notes
- Rate map: already wired for a widget. To extend coverage, add entries to `kb/rates/tax_rates.json` with `code`, `name`, `tax_name`, `standard_rate`, and `verify_url`.
- Landing/home: `kb/home_layout.json` drives hero, chips, featured, templates, and whether to show the rates/tips sections.
- Production swap: replace the demo rates section with your `RatesWidget` and optionally preload `tips_source` to enable glossary tooltips.

