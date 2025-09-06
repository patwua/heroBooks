"use client";

import Link from "next/link";

type Props = React.ComponentProps<typeof Link> & {
  event: string;
  meta?: Record<string, unknown>;
};

export default function TrackLink({ event, meta, onClick, ...rest }: Props) {
  async function track(e: React.MouseEvent<HTMLAnchorElement>) {
    try {
      // fire-and-forget; do not block navigation
      fetch("/api/track/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, meta }),
        keepalive: true,
      });
    } catch {}
    onClick?.(e);
  }
  return <Link {...rest} onClick={track} />;
}
