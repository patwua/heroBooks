import Link from "next/link";
import {
  getActiveOrgId,
  getFeatureStatuses,
  FEATURE_REGISTRY,
  reasonText,
  getUserUiSettings,
} from "@/lib/features";

function LockedBadge({ reason }: { reason: string }) {
  const text = reasonText(reason as any);
  return (
    <span
      title={text}
      className="ml-2 text-[10px] rounded bg-muted px-1 py-0.5 cursor-help"
    >
      Locked
    </span>
  );
}

function NavItem({ href, label }: { href: string; label: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </Link>
  );
}

export default async function Sidebar() {
  const orgId = await getActiveOrgId();
  const { hideLockedFeatures } = await getUserUiSettings();

  const statuses = await getFeatureStatuses(
    FEATURE_REGISTRY.map((f) => f.key),
    orgId,
  );

  const groups: Record<
    string,
    { label: string; items: { meta: any; locked: boolean; reason: string }[] }
  > = {
    accounting: { label: "Accounting", items: [] },
    reports: { label: "Reports", items: [] },
    settings: { label: "Settings", items: [] },
  };

  for (const meta of FEATURE_REGISTRY) {
    const st = statuses[meta.key];
    const locked = !st.allowed;
    if (hideLockedFeatures && locked) continue;
    groups[meta.group].items.push({ meta, locked, reason: st.reason });
  }

  return (
    <aside className="w-60 shrink-0 border-r bg-background p-3 text-sm">
      {Object.values(groups).map((g) => (
        <div key={g.label} className="space-y-1 mb-4">
          <div className="px-2 py-1 text-xs uppercase text-muted-foreground">
            {g.label}
          </div>
          {g.items.map(({ meta, locked, reason }) => (
            <NavItem
              key={meta.key}
              href={meta.route}
              label={
                <>
                  <span>{meta.label}</span>
                  {locked && <LockedBadge reason={reason} />}
                </>
              }
            />
          ))}
        </div>
      ))}

      {/* Hide/Show toggle lives in topbar, see Topbar */}
    </aside>
  );
}

