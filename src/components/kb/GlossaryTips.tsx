"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Term = {
  term: string;
  aliases?: string[];
  description?: string;
  related?: string[];
};

type GlossaryIndex = Map<string, Term>;

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMatcher(keys: string[]) {
  if (keys.length === 0) return null;
  const sorted = [...keys].sort((a, b) => b.length - a.length);
  const parts = sorted.map((k) => {
    const esc = escapeRegex(k);
    // If the key is alphanumeric/space/hyphen only, use word boundaries.
    // Else (e.g., 7/57, r/(100+r)), don't add boundaries.
    if (/^[A-Za-z0-9\- ]+$/.test(k)) return `\\b${esc}\\b`;
    return `${esc}`;
  });
  try {
    return new RegExp(parts.join("|"), "gi");
  } catch {
    return null;
  }
}

function isExcluded(node: Node): boolean {
  // Skip inside anchors, code/pre, script/style, interactive/form controls, and any .no-glossary
  let el: Node | null = node.parentNode;
  while (el && el.nodeType === Node.ELEMENT_NODE) {
    const e = el as HTMLElement;
    const tag = e.tagName.toLowerCase();
    if (
      tag === "a" ||
      tag === "code" ||
      tag === "pre" ||
      tag === "script" ||
      tag === "style" ||
      tag === "textarea" ||
      tag === "input" ||
      tag === "select" ||
      tag === "button" ||
      tag === "svg" ||
      e.classList.contains("no-glossary") ||
      e.getAttribute("data-no-glossary") != null
    ) {
      return true;
    }
    el = e.parentElement;
  }
  return false;
}

function processHtml(html: string, index: GlossaryIndex) {
  if (!html || index.size === 0) return html;
  const container = document.createElement("div");
  container.innerHTML = html;

  const keys = Array.from(index.keys());
  const rx = buildMatcher(keys);
  if (!rx) return html;

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (isExcluded(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    } as unknown as NodeFilter,
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  for (const textNode of textNodes) {
    const txt = textNode.nodeValue || "";
    const frag = document.createDocumentFragment();
    let mutated = false;

    // Protect URL-like substrings from matching.
    const urlRx = /(https?:\/\/[\S]+|www\.[\S]+)/gi;
    let cursor = 0;
    let urlMatch: RegExpExecArray | null;
    const processSegment = (segment: string) => {
      rx.lastIndex = 0;
      let m: RegExpExecArray | null;
      let last = 0;
      let localMutated = false;
      while ((m = rx.exec(segment))) {
        const start = m.index;
        const end = start + m[0].length;
        if (start > last) frag.appendChild(document.createTextNode(segment.slice(last, start)));
        const span = document.createElement("span");
        span.className = "term underline decoration-dotted underline-offset-2 cursor-help";
        const original = m[0];
        span.setAttribute("data-term", original);
        span.textContent = original;
        frag.appendChild(span);
        last = end;
        localMutated = true;
      }
      if (localMutated) mutated = true;
      if (last < segment.length) frag.appendChild(document.createTextNode(segment.slice(last)));
    };

    while ((urlMatch = urlRx.exec(txt))) {
      const start = urlMatch.index;
      const end = start + urlMatch[0].length;
      if (start > cursor) processSegment(txt.slice(cursor, start));
      // Append URL as-is
      frag.appendChild(document.createTextNode(txt.slice(start, end)));
      cursor = end;
    }
    if (cursor < txt.length) processSegment(txt.slice(cursor));

    if (mutated) {
      textNode.parentNode?.replaceChild(frag, textNode);
    }
  }

  return container.innerHTML;
}

export default function GlossaryTips({ html }: { html: string }) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [index, setIndex] = useState<GlossaryIndex>(() => new Map());
  const [active, setActive] = useState<Term | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/kb/kb_glossary.json")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const arr: Term[] = Array.isArray(data?.terms) ? data.terms : [];
        setTerms(arr);
        const map: GlossaryIndex = new Map();
        for (const t of arr) {
          const keys = [t.term, ...(t.aliases || [])];
          keys.forEach((k) => map.set(String(k).toLowerCase(), t));
        }
        setIndex(map);
      })
      .catch(() => {
        setTerms([]);
        setIndex(new Map());
      });
    return () => {
      mounted = false;
    };
  }, []);

  // After mount, enhance the already-SSR'd HTML by wrapping matches.
  useEffect(() => {
    const host = hostRef.current;
    if (!host || index.size === 0) return;
    try {
      const out = processHtml(html, index);
      host.innerHTML = out;
    } catch {
      // ignore
    }
  }, [html, index]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const t = target.closest(".term") as HTMLElement | null;
      if (!t) return;
      const key = (t.dataset.term || "").toLowerCase();
      const term = index.get(key) || null;
      if (term) {
        setActive(term);
      }
    }
    host.addEventListener("click", onClick);
    return () => host.removeEventListener("click", onClick);
  }, [index]);

  return (
    <div className="relative">
      {/* Render raw HTML to match SSR, then enhance in effect */}
      {/* eslint-disable-next-line react/no-danger */}
      <div ref={hostRef} className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert leading-relaxed space-y-6 kb-article\" dangerouslySetInnerHTML={{ __html: html }} />

      {active ? (
        <aside className="sticky top-24 float-right ml-6 w-full sm:w-80 md:w-96">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
              <strong className="font-semibold">{active.term}</strong>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-sm text-muted-foreground hover:underline"
                aria-label="Close glossary panel"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              {active.description ? (
                <p className="text-sm leading-relaxed">{active.description}</p>
              ) : null}
              {Array.isArray(active.related) && active.related.length > 0 ? (
                <div className="mt-3">
                  <div className="text-xs uppercase text-muted-foreground">Related</div>
                  <ul className="mt-1 space-y-1 text-sm">
                    {active.related.map((slug) => (
                      <li key={slug}>
                        <a className="text-primary hover:underline" href={`/kb/${slug}`}>{slug}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}


