"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Package, FileText, CreditCard,
  Building2, Receipt, Banknote, Table2, ChartBar, Settings, ShieldCheck
} from "lucide-react";
import { useEffect, useState } from "react";

const adminSection = {
  label: "Admin",
  items: [{ href: "/admin/billing", icon: ShieldCheck, label: "Billing" }],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Non-sensitive UI hint: if ADMIN_EMAILS is set at build time, show the link.
    if (process.env.NEXT_PUBLIC_HAS_ADMIN === "1") setShowAdmin(true);
  }, []);

  const sections = [
    {
      label: "Overview",
      items: [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }],
    },
    {
      label: "Sales",
      items: [
        { href: "/customers", icon: Users, label: "Customers" },
        { href: "/items", icon: Package, label: "Items" },
        { href: "/estimates", icon: FileText, label: "Estimates" },
        { href: "/invoices", icon: Receipt, label: "Invoices" },
        { href: "/payments", icon: CreditCard, label: "Payments" },
      ],
    },
    {
      label: "Purchases",
      items: [
        { href: "/vendors", icon: Building2, label: "Vendors" },
        { href: "/bills", icon: Receipt, label: "Bills" },
      ],
    },
    {
      label: "Banking",
      items: [{ href: "/banking/imports", icon: Banknote, label: "Import & Reconcile" }],
    },
    {
      label: "Reports",
      items: [
        { href: "/reports/vat", icon: Table2, label: "VAT Summary" },
        { href: "/reports/trial-balance", icon: ChartBar, label: "Trial Balance" },
        { href: "/reports/profit-loss", icon: ChartBar, label: "Profit & Loss" },
      ],
    },
    {
      label: "Settings",
      items: [
        { href: "/settings/profile", icon: Settings, label: "Profile" },
        { href: "/settings/organization", icon: Settings, label: "Organization" },
        { href: "/settings/branding", icon: Settings, label: "Branding" },
      ],
    },
  ];

  if (showAdmin) sections.push(adminSection as any);

  return (
    <aside className="w-64 shrink-0 border-r bg-background/60 backdrop-blur">
      <div className="p-4">
        <div className="text-xl font-semibold">heroBooks</div>
      </div>
      <nav className="px-2 pb-6 space-y-6">
        {sections.map((s: any) => (
          <div key={s.label}>
            <div className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {s.label}
            </div>
            <ul className="space-y-1">
              {s.items.map((item: any) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
