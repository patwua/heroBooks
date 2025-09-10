"use client";
import { useEffect } from "react";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${d.toUTCString()}`;
}

export default function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = getCookie("kb_view_counts");
      const obj: Record<string, number> = raw ? JSON.parse(raw) : {};
      obj[slug] = (obj[slug] || 0) + 1;
      // keep only top 50 entries
      const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 50);
      setCookie("kb_view_counts", JSON.stringify(Object.fromEntries(entries)));

      // recency cookie: store last view time per slug
      const now = Date.now();
      const recRaw = getCookie("kb_view_times");
      const rec: Record<string, number> = recRaw ? JSON.parse(recRaw) : {};
      rec[slug] = now;
      const recEntries = Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, 50);
      setCookie("kb_view_times", JSON.stringify(Object.fromEntries(recEntries)));
    } catch {}
  }, [slug]);
  return null;
}
