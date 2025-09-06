"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#why-local", label: "Why Local" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/heroBooks mini Color.png" alt="heroBooks" width={24} height={24} />
          <span className="font-semibold tracking-tight">heroBooks</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="text-sm px-3 py-1.5 rounded-md hover:bg-muted">Sign in</Link>
          <Link href="/get-started" className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Get started</Link>
        </div>
      </div>
      <div className="w-full bg-primary/10 border-t">
        <div className="container mx-auto px-4 py-2 text-xs sm:text-sm text-center">
          🎉 Early adopters: 2 months <b>50% off</b> on Business plan. Use code <b>GYA-LAUNCH</b>.
        </div>
      </div>
    </header>
  );
}
