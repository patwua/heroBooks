"use client";
import { useEffect, useState } from "react";

export default function HideLockedSwitch() {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings/ui");
      const j = await res.json();
      setChecked(!!j?.data?.hideLockedFeatures);
      setLoading(false);
    })();
  }, []);

  async function toggle(v: boolean) {
    setChecked(v);
    await fetch("/api/settings/ui", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hideLockedFeatures: v }),
    });
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        disabled={loading}
        checked={checked}
        onChange={(e) => toggle(e.target.checked)}
      />
      Hide inactive
    </label>
  );
}

