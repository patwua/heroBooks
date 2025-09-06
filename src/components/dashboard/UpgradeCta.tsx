"use client";

export default function UpgradeCta() {
  return (
    <a
      href="/pricing?next=/checkout&highlight=business"
      onClick={() => {
        fetch("/api/track/marketing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "upgrade_cta_click",
            meta: { source: "dashboard_hint" },
          }),
          keepalive: true,
        });
      }}
      className="inline-flex items-center rounded-md bg-emerald-600 text-white px-3 py-1.5 text-sm hover:bg-emerald-700"
    >
      Upgrade
    </a>
  );
}

