"use client";
import { useState } from "react";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${d.toUTCString()}`;
}

export default function DismissTopic({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);
  if (done) return <span className="text-xs text-muted-foreground">Hidden from tips</span>;
  return (
    <button
      className="text-xs text-muted-foreground hover:underline"
      onClick={() => {
        try {
          const raw = getCookie('kb_tips_dismissed');
          const arr: string[] = raw ? JSON.parse(raw) : [];
          if (!arr.includes(slug)) arr.push(slug);
          setCookie('kb_tips_dismissed', JSON.stringify(arr));
          setDone(true);
        } catch {}
      }}
      aria-label="Dismiss this topic from tips"
    >
      Dismiss this topic
    </button>
  );
}

