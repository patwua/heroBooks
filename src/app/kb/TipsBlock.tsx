"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${d.toUTCString()}`;
}

export default function TipsBlock() {
  const [items, setItems] = useState<Array<{slug: string;title: string;summary?: string;}>>([]);
  useEffect(() => {
    fetch("/api/kb/tips").
    then((r) => r.json()).
    then((j) => setItems(j.results || [])).
    catch(() => setItems([]));
  }, []);
  if (!items.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((t) =>
      <div key={t.slug} className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/kb/${t.slug}`} className="font-medium hover:underline">
              {t.title}
            </Link>
            <button
            className="text-xs text-muted-foreground hover:underline"
            onClick={() => {
              try {
                const raw = getCookie('kb_tips_dismissed');
                const arr: string[] = raw ? JSON.parse(raw) : [];
                if (!arr.includes(t.slug)) arr.push(t.slug);
                setCookie('kb_tips_dismissed', JSON.stringify(arr));
                setItems((prev) => prev.filter((x) => x.slug !== t.slug));
              } catch {}
            }}
            aria-label="Dismiss this tip">

              Dismiss
            </button>
          </div>
          {(t.summary ? <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.summary}</div> : null)}
        </div>
      )}
    </div>);

}