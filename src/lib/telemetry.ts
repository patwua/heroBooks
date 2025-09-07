export type FeatureImpressionPayload = {
  feature: string;
  reason?: string;
  path?: string;
  orgId?: string;
  userId?: string;
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
    console.warn("telemetry failed", err);
  }
}
