"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Option = { id: string; name: string; logoUrl: string | null };

export default function OrgSwitcherClient({
  onSwitched,
}: {
  onSwitched?: () => void;
}) {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, start] = useTransition();

  useEffect(() => {
    fetch("/api/orgs")
      .then((res) => res.json())
      .then((data) => {
        setOrgs(data.orgs ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-muted-foreground">Loading…</div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {orgs.map((o) => (
        <button
          key={o.id}
          disabled={pending}
          onClick={() =>
            start(async () => {
              await fetch("/api/org/switch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orgId: o.id }),
              }).catch(() => {});
              router.refresh();
              onSwitched?.();
            })
          }
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted text-left"
        >
          {o.logoUrl ? (
            <Image
              src={o.logoUrl}
              alt={o.name}
              width={18}
              height={18}
              className="rounded"
            />
          ) : (
            <div className="h-4 w-4 rounded bg-muted" />
          )}
          <span>{o.name}</span>
        </button>
      ))}
    </div>
  );
}

