"use client";

import { useEffect } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";
import { Story } from "@/lib/stories";

export default function ComingSoonOverlay({
  story,
  trySetup = false,
}: {
  story: Story;
  trySetup?: boolean;
}) {
  useEffect(() => {
    recordFeatureImpression({
      feature: "story_overlay_view",
      meta: { story_id: story.id, status: "pending consent" },
    });
  }, [story.id]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90 p-4 text-center"
      aria-label={`Story coming soon: ${story.title}. Awaiting customer approval`}
    >
      <span
        className="absolute right-2 top-2 rounded bg-amber-200 px-2 py-1 text-xs font-medium text-amber-800"
        title="Awaiting customer approval"
      >
        Pending consent
      </span>
      <div className="text-lg font-semibold">Coming soon</div>
      <div className="text-sm">Awaiting customer approval</div>
      <button
        className="mt-2 cursor-not-allowed rounded-lg border px-3 py-1 text-sm opacity-60"
        disabled
        title="This story will be available shortly."
        onMouseEnter={() =>
          recordFeatureImpression({
            feature: "story_overlay_cta_hover",
            meta: { story_id: story.id },
          })
        }
      >
        See how heroBooks works for them
      </button>
      {trySetup && (
        <a
          href={story.try_setup_href}
          className="mt-1 text-sm font-medium underline"
          onClick={() =>
            recordFeatureImpression({
              feature: "story_overlay_try_setup_click",
              meta: { story_id: story.id, href: story.try_setup_href },
            })
          }
        >
          Try this setup
        </a>
      )}
    </div>
  );
}
