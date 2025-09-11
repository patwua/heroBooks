KB Front-End Wiring (Search, Tips, Home)

This repo ships prebuilt JSON indices and config so you can wire a fast, assistive UI without extra back-end.

Core data
- Search index: `kb/search_index.json` (array of articles with html_excerpt)
- Snippet index: `kb/kb_assist_index.json` ({ kb_snippets: [...] })
- Glossary (tips): `kb/kb_glossary.json` (terms, aliases, descriptions, related)
- Rates: `kb/rates/tax_rates.json` (country → indicative rate + verify_url)
- Home layout: `kb/home_layout.json` (hero, quick chips, featured, templates, widgets)

Tips / glossary rendering
- Load `kb/kb_glossary.json` once.
- Build a case-insensitive matcher for `term` and `aliases`; match whole words.
- During article render, wrap matches in `<span data-term="VAT">VAT</span>`.
- On click/hover, open a right-pane card showing:
  - term, description
  - related article links (slugs in `related`)
  - a close button
- Scope: avoid matching inside code blocks or URLs; keep perf by limiting to visible content.

Rates widget
- Load `kb/rates/tax_rates.json`.
- Provide a simple selector (Guyana default). Show `tax_name`, `standard_rate` (or “—”), and a prominent `Verify` link.
- Show a footnote: “Rates change — verify before use.”

Home page
- Load `kb/home_layout.json`.
- Render hero (title/subtitle/search). Bind search to `kb/search_index.json`.
- Show `quick_chips` → navigate to the article slug.
- Grid `featured_articles` → title/summary; add region toggle (Guyana/Caribbean) to bias results.
- Templates carousel using `featured_templates`.
- If `widgets.show_rates`, mount the rates widget using `widgets.rates_source`.
- If `widgets.show_tips`, preload `widgets.tips_source` for instant tooltips.

Assist / snippets
- Use `kb/kb_assist_index.json.kb_snippets` to answer short questions (“howto”, “faq”, “definition”).
- Route by intent; show article links using `id/slug` from the snippet entry.

Build & guard
- `npm run kb:report` builds indices and fails on non-draft placeholders.
- Add terms to `kb/glossary.yml` → the build writes `kb/kb_glossary.json`.

