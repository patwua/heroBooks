# heroBooks Knowledge Base

This folder contains the content and indexes for the heroBooks Knowledge Base.

## Structure

- `taxonomy.json` — hierarchical list of categories and topics.
- `articles/` — Markdown articles with YAML front‑matter.
- `kb_assist_index.json` — snippets and assistant keys compiled from articles.
- `search_index.json` — basic search index for titles and tags.
- `right_rail.yaml` — NIS/GRA quick links, popular snippets, internal promos.
- `brand_options.md` — candidate banner slogans.

## Downloading research drafts

Run `pnpm kb:download` to fetch the latest research drafts from the shared
Google Drive. The script requires `gdown` (install with `pip install gdown`).
Files are placed in `kb/drive_raw` for manual conversion to Markdown articles.

## Maintenance

1. Update articles regularly; set `last_reviewed` to the current ISO date.
2. Verify all rates and thresholds against official GRA and NIS sources.
3. Run `pnpm lint` before committing to ensure formatting and types are valid.
4. Rebuild `kb_assist_index.json` and `search_index.json` after adding or editing articles.

## Review Cycle

Facts tied to filing periods or statutory rates should be reviewed every 6 months.
Use analytics events to flag articles with old `last_reviewed` dates.

## Sourcing Policy

Prefer primary sources such as the Guyana Revenue Authority, National Insurance Scheme,
and Caribbean Examinations Council. Secondary sources may supplement but must be
clearly attributed.

*Information is general in nature and not a substitute for professional tax or
legal advice.*