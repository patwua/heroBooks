import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
  { href: "/sales", label: "Sales (Create)" },
  { href: "/sales/invoices", label: "Invoices" },
  { href: "/app/sales/estimates", label: "Sales: Estimates" },
  { href: "/sales/payments", label: "Payments" },
  { href: "/reports/ar-aging", label: "Reports: A/R Aging" },
  { href: "/reports/vat", label: "Reports: VAT" },
  { href: "/app/purchases/bills", label: "Purchases: Bills" },
  { href: "/vendors", label: "Vendors" },
  { href: "/settings", label: "Settings" },
  { href: "/app/bank", label: "Bank Reconciliation" }
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
