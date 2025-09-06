import Link from "next/link";
import { auth } from "@/lib/auth";
import { getActiveOrgId, getFeatureStatuses } from "@/lib/features";

export default async function Sidebar() {
  const session = await auth();
  const orgId = await getActiveOrgId();
  const statuses = await getFeatureStatuses(["payroll"], orgId);

  const payroll = statuses.payroll;
  const locked = !payroll.allowed;
  const reasonText =
    payroll.reason === "plan"
      ? "Locked – Upgrade required"
      : payroll.reason === "toggle"
        ? "Locked – Enable in Settings"
        : "Locked";

  const badge = locked ? (
    <span
      className="ml-2 text-[10px] rounded bg-muted px-1 py-0.5"
      title={reasonText}
      aria-label={reasonText}
    >
      Locked
    </span>
  ) : null;

  return (
    <aside className="w-60 shrink-0 border-r bg-background p-3 text-sm">
      <div className="space-y-1">
        <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Accounting</div>
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/invoices" label="Invoices" />
        <NavItem href="/estimates" label="Estimates" />
        <NavItem href="/customers" label="Customers" />
        <NavItem href="/vendors" label="Vendors" />
        <NavItem href="/items" label="Products & Services" />
        <NavItem
          href="/payroll"
          label={
            <>
              <span>Payroll</span>
              {badge}
            </>
          }
        />
      </div>

      <div className="mt-4 space-y-1">
        <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Reports</div>
        <NavItem href="/reports/vat" label="VAT" />
        <NavItem href="/reports/trial-balance" label="Trial Balance" />
        <NavItem href="/reports/profit-loss" label="Profit & Loss" />
        <NavItem
          href="/reports/payroll"
          label={
            <>
              <span>Payroll Summary</span>
              {badge}
            </>
          }
        />
      </div>

      <div className="mt-4 space-y-1">
        <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Settings</div>
        <NavItem href="/settings/organization" label="Organization" />
        <NavItem href="/settings/profile" label="Profile" />
        <NavItem href="/settings/branding" label="Branding" />
      </div>
    </aside>
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
