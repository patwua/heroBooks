export type FeatureImpressionPayload = {
  feature: string;
  reason?: string;
  path?: string;
  orgId?: string | null;
  userId?: string | null;
  meta?: Record<string, any>;
};

export async function recordFeatureImpression(payload: FeatureImpressionPayload) {
  try {
    await fetch("/api/telemetry/feature-impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    // Swallow errors to avoid breaking UX
    console.warn("telemetry failed", err);
  }
}

export function withTelemetryCtx(
  getCtx: () => { userId?: string | null; orgId?: string | null } | null
) {
  return (payload: Omit<FeatureImpressionPayload, "userId" | "orgId">) => {
    const ctx = getCtx?.() || {};
    return recordFeatureImpression({
      ...payload,
      userId: ctx.userId ?? null,
      orgId: ctx.orgId ?? null,
    });
  };
}
