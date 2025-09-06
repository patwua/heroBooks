"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LockedBadge from "./LockedBadge";
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Receipt,
  Building2,
  Settings,
  Tags,
  Banknote,
  Wallet,
} from "lucide-react";

const groups = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [
      { href: "/invoices", label: "Invoices", icon: FileText },
      { href: "/estimates", label: "Estimates", icon: Tags },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/payments", label: "Payments", icon: Wallet },
    ],
  },
  {
    label: "Purchases",
    items: [
      { href: "/bills", label: "Bills", icon: Receipt },
      { href: "/vendors", label: "Vendors", icon: Building2 },
      { href: "/items", label: "Items", icon: Package },
    ],
  },
  {
    label: "Reports",
    items: [{ href: "/reports", label: "Reports", icon: Banknote }],
  },
  {
    label: "Organization",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-background">
      <div className="h-14 px-4 flex items-center gap-2 border-b">
        <Image
          src="/logos/heroBooks mini Color.png"
          width={24}
          height={24}
          alt="heroBooks"
        />
        <span className="font-semibold tracking-tight">heroBooks</span>
      </div>
      <nav className="px-2 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              {g.label}
            </div>
            <ul className="space-y-1">
              {g.items.map((item) => {
                const active =
                  pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                const locked = false;
                const reason: string | undefined = undefined;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {locked && <LockedBadge reason={reason ?? "Locked"} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom profile/settings area remains (your existing component/link) */}
      <div className="mt-auto px-2 py-3 border-t text-xs text-muted-foreground">
        <Link href="/profile" className="hover:underline">
          Profile & Avatar
        </Link>
      </div>
    </aside>
  );
}

