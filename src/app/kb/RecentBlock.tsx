"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Item = {slug: string;title: string;summary?: string;};

export default function RecentBlock() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('kb_read_slugs');
      const slugs: string[] = raw ? JSON.parse(raw) : [];
      if (!slugs.length) return;
      fetch('/api/kb/index').
      then((r) => r.json()).
      then((all: Item[]) => {
        const map = new Map(all.map((a) => [a.slug, a] as const));
        const recent = slugs.slice(-6).reverse().map((s) => map.get(s)).filter(Boolean) as Item[];
        setItems(recent);
      }).
      catch(() => setItems([]));
    } catch {}
  }, []);
  if (!items.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((a) =>
      <Link key={a.slug} href={`/kb/${a.slug}`} className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="font-medium">{a.title}</div>
          {(a.summary ? <div className="text-sm text-muted-foreground line-clamp-2">{a.summary}</div> : null)}
        </Link>
      )}
    </div>);

}