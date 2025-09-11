Packed Illustrations: Optional CSS

Use this tiny CSS to make images under `/kb/illustrations/` float right and wrap neatly inside paragraphs (no borders, clean spacing). Import it after your base styles so it overrides generic prose image rules.

Copy/paste into your CSS
```css
/* Float and wrap only KB illustration assets */
.prose p > img[src^="/kb/illustrations/"] {
  float: right;
  width: min(360px, 45%);
  height: auto;
  margin: 0.25rem 0 1rem 1rem;
  border: 0 !important;    /* ensure no borders even if base prose adds one */
  box-shadow: none;
  /* optional rounded look without visible border */
  border-radius: 0.75rem;
  /* better wrap around rounded corners on modern browsers */
  shape-outside: margin-box;
}

/* Stack on small screens */
@media (max-width: 640px) {
  .prose p > img[src^="/kb/illustrations/"] {
    float: none;
    display: block;
    width: 100%;
    margin: 0.5rem 0 0.75rem 0;
  }
}
```

How to import
- Global file: paste the block at the end of `src/app/global.css`.
- Separate file: save as `src/styles/kb.css` and import from your `src/app/layout.tsx` or via `@import 'src/styles/kb.css';` inside `global.css`.

Notes
- Selector targets only images served from `/kb/illustrations/...`, leaving other images unaffected.
- If you already float all `.prose img` globally, keep this block after those rules so it takes precedence for KB illustrations.
