Article Banner spec (heading nested in the banner)

Objective
- Nest the article heading inside an article banner placed directly beneath the global page banner.
- The banner uses a gradient derived from the page banner color.
- Content in the banner:
  - H1: main title text
  - H2 (optional): subtitle/qualifier line
  - Meta: Source/@link • read time • reviewed date
  - Actions: Follow (or Save), Dismiss suggestions (optional)
- Breadcrumbs below the article banner: Home › Category (clickable) › Current.

Suggested React structure (JSX)
```tsx
export function ArticleBanner({
  titleMain,
  titleSub,
  sourceHref,
  sourceLabel,
  readTime,
  reviewedDate,
  categoryLabel,
  categoryHref,
}) {
  return (
    <header className="kb-article-banner">
      <div className="kb-article-banner-inner">
        <h1 className="kb-title">{titleMain}</h1>
        {titleSub && <h2 className="kb-subtitle">{titleSub}</h2>}
        <div className="kb-meta">
          <a href={sourceHref} target="_blank" rel="noreferrer">@ {sourceLabel}</a>
          <span>• {readTime}</span>
          <span>• {reviewedDate}</span>
        </div>
        <div className="kb-actions">
          <button className="btn-primary">Follow</button>
          <button className="btn-ghost">Dismiss suggestions</button>
        </div>
      </div>
      <nav className="kb-breadcrumbs">
        <a href="/kb">Knowledge Base</a>
        <span>›</span>
        <a href={categoryHref}>{categoryLabel}</a>
        <span>›</span>
        <span aria-current="page">Current</span>
      </nav>
    </header>
  );
}
```

CSS (gradient + layout)
```
.kb-article-banner {
  background: linear-gradient(135deg, var(--brand-600), var(--brand-500));
  color: white;
  padding: 2rem 1rem 1.25rem;
}
.kb-article-banner-inner { max-width: 72rem; margin: 0 auto; }
.kb-title { font-size: clamp(1.75rem, 3vw, 2.25rem); font-weight: 800; margin: 0; }
.kb-subtitle { font-size: clamp(1rem, 2vw, 1.25rem); opacity: .9; margin: .25rem 0 0; }
.kb-meta { display: flex; gap: .75rem; align-items: center; margin-top: .5rem; opacity: .9; }
.kb-meta a { color: #fff; text-decoration: underline; text-underline-offset: 2px; }
.kb-actions { display: flex; gap: .5rem; margin-top: .75rem; }
.btn-primary { background: #fff; color: var(--brand-700); border: 0; padding: .5rem .75rem; border-radius: .5rem; font-weight: 600; }
.btn-ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.5); padding: .5rem .75rem; border-radius: .5rem; }
.kb-breadcrumbs { max-width: 72rem; margin: .5rem auto 0; color: var(--slate-600); display: flex; gap: .5rem; align-items: center; }
.kb-breadcrumbs a { color: var(--slate-700); text-decoration: none; }
.kb-breadcrumbs a:hover { text-decoration: underline; }
```

Notes
- Split titles: style the main part as H1 and a qualifier as H2. E.g., H1 = "Bank rules to auto‑categorize common transactions"; H2 = "(and when not to)".
- Source behavior: clickable external link ("@ central.xero.com"). If no source, hide.
- Actions: "Follow" (subscribe/save) and optional "Dismiss suggestions" (hide from recommended listing but still searchable). Wire these to your state/store.
- Category link: points to the category listing page (e.g., `/kb/category/banking-reconciliation`) and should list related/child articles.

