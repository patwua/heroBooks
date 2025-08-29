import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/customers", label: "Customers" },
  { href: "/app/sales", label: "Sales" },
  { href: "/app/vendors", label: "Vendors" },
  { href: "/app/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="h-full w-64 shrink-0 border-r border-slate-800 bg-slate-950/40 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-4">
        <Image src="/logo.svg" alt="heroBooks" width={28} height={28} />
        <span className="font-semibold">heroBooks</span>
      </div>
      <nav className="px-2 py-2 space-y-1">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/60">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
