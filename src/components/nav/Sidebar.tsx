import Link from "next/link";
import { canUseFeature, getActiveOrgId } from "@/lib/features";

export default async function Sidebar() {
  const orgId = await getActiveOrgId();

  const showPayroll = await canUseFeature("payroll", orgId);
  const showPayrollReport = await canUseFeature("payroll", orgId);

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
        {showPayroll && <NavItem href="/payroll" label="Payroll" />}
      </div>

      <div className="mt-4 space-y-1">
        <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Reports</div>
        <NavItem href="/reports/vat" label="VAT" />
        <NavItem href="/reports/trial-balance" label="Trial Balance" />
        <NavItem href="/reports/profit-loss" label="Profit & Loss" />
        {showPayrollReport && <NavItem href="/reports/payroll" label="Payroll Summary" />}
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

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground">
      {label}
    </Link>
  );
}
