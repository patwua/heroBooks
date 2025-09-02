"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export default function IntentRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");

  async function update(status: "paid" | "failed" | "cancelled") {
    startTransition(async () => {
      const res = await fetch(`/api/admin/checkout-intents/${id}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error ?? "Update failed");
        return;
      }
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="rounded border px-2 py-1 text-xs bg-background w-40"
        placeholder="note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button disabled={pending} onClick={() => update("paid")} className="text-xs px-2 py-1 rounded bg-green-600 text-white disabled:opacity-60">
        Mark paid
      </button>
      <button disabled={pending} onClick={() => update("failed")} className="text-xs px-2 py-1 rounded bg-red-600 text-white disabled:opacity-60">
        Mark failed
      </button>
      <button disabled={pending} onClick={() => update("cancelled")} className="text-xs px-2 py-1 rounded bg-amber-600 text-white disabled:opacity-60">
        Cancel
      </button>
    </div>
  );
}
