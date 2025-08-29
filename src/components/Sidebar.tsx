import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav>
        <ul className="space-y-2">
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/customers">Customers</Link></li>
          <li><Link href="/sales">Sales (Create)</Link></li>
          <li><Link href="/sales/invoices">Invoices</Link></li>
          <li><Link href="/sales/payments">Payments</Link></li>
          <li><Link href="/reports/ar-aging">Reports: A/R Aging</Link></li>
          <li><Link href="/reports/vat">Reports: VAT</Link></li>
          <li><Link href="/app/purchases/bills">Purchases: Bills</Link></li>
          <li><Link href="/vendors">Vendors</Link></li>
          <li><Link href="/settings">Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
