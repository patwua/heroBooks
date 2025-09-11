React snippets: Tips (glossary) and Rates widget

Prereqs
- Any React app (Vite, CRA, Next). Place JSON files under `/kb/...` as shipped.

Glossary (tips) — Right-pane with clickable terms
```jsx
import { useEffect, useMemo, useState } from 'react';

function useGlossary() {
  const [terms, setTerms] = useState([]);
  useEffect(() => {
    fetch('/kb/kb_glossary.json')
      .then(r => r.json())
      .then(data => setTerms(data.terms || []));
  }, []);
  const index = useMemo(() => {
    const map = new Map();
    for (const t of terms) {
      const keys = [t.term, ...(t.aliases || [])];
      keys.forEach(k => map.set(k.toLowerCase(), t));
    }
    return map;
  }, [terms]);
  return { terms, index };
}

export function GlossaryTips({ html }) {
  const { index } = useGlossary();
  const [active, setActive] = useState(null);

  // naive walker: only for demo; in prod, avoid matching inside code/links
  const content = useMemo(() => {
    if (!html || index.size === 0) return { __html: html };
    let out = html;
    for (const key of index.keys()) {
      const rx = new RegExp(`\\b(${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'gi');
      out = out.replace(rx, '<span class="term" data-term="$1">$1</span>');
    }
    return { __html: out };
  }, [html, index]);

  useEffect(() => {
    function onClick(e) {
      const t = e.target.closest('.term');
      if (!t) return;
      const key = t.dataset.term.toLowerCase();
      setActive(index.get(key) || null);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [index]);

  return (
    <div className="kb">
      <div className="kb-article" dangerouslySetInnerHTML={content} />
      {active && (
        <aside className="kb-tips">
          <header>
            <strong>{active.term}</strong>
            <button onClick={() => setActive(null)}>×</button>
          </header>
          <p>{active.description}</p>
          {active.related?.length > 0 && (
            <ul>
              {active.related.map((slug) => (
                <li key={slug}><a href={`/kb/${slug}`}>{slug}</a></li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </div>
  );
}
```

Rates widget (with Verify link)
```jsx
import { useEffect, useState } from 'react';

export function RatesWidget({ defaultCode = 'GY' }) {
  const [data, setData] = useState(null);
  const [code, setCode] = useState(defaultCode);
  useEffect(() => {
    fetch('/kb/rates/tax_rates.json')
      .then(r => r.json())
      .then(setData);
  }, []);
  if (!data) return null;
  const countries = data.countries || [];
  const sel = countries.find(c => c.code === code) || countries[0];
  return (
    <div className="rates">
      <select value={code} onChange={e => setCode(e.target.value)}>
        {countries.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <div className="card">
        <div>{sel.tax_name}</div>
        <div>Standard rate: {sel.standard_rate ?? '—'}{sel.standard_rate != null ? '%' : ''}</div>
        <a href={sel.verify_url} target="_blank" rel="noreferrer">Verify at authority</a>
        <small>Rates change — verify before use.</small>
      </div>
    </div>
  );
}
```

