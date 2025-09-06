"use client";
import { useEffect, useState } from "react";

export default function FeatureGuard({
  feature,
  children,
}: {
  feature: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<
    { allowed: boolean; reason: "ok" | "toggle" | "plan" | "super" } | null
  >(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/settings/feature-status?f=${encodeURIComponent(feature)}`,
      );
      const j = await res.json();
      setState(j.data);

      // Telemetry: only when locked
      if (j?.data && !j.data.allowed) {
        try {
          await fetch("/api/telemetry/feature-impression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              feature,
              reason: j.data.reason,
              path: window.location.pathname,
            }),
          });
        } catch {}
      }
    })();
  }, [feature]);

  if (!state) return null;
  if (state.allowed) return <>{children}</>;

  const heading = state.reason === "plan" ? "Upgrade required" : "Activation required";
  const body =
    state.reason === "plan"
      ? "Your current plan does not include this feature. Upgrade to unlock it."
      : "This feature is available on your plan but disabled. You can enable it in Settings (tax and statutory settings may require additional inputs).";

  return (
    <div className="max-w-lg space-y-2">
      <div className="text-lg font-semibold">{heading}</div>
      <div className="text-sm text-muted-foreground">{body}</div>
      <div className="flex gap-2 pt-2">
        {state.reason === "plan" ? (
          <a
            href="/pricing?highlight=business"
            className="px-3 py-2 rounded bg-primary text-primary-foreground text-sm"
          >
            See plans
          </a>
        ) : (
          <a
            href="/settings/organization#taxes"
            className="px-3 py-2 rounded bg-primary text-primary-foreground text-sm"
          >
            Enable in Settings
          </a>
        )}
        <a href="/contact" className="px-3 py-2 rounded bg-muted text-sm">
          Talk to us
        </a>
      </div>
    </div>
  );
}
