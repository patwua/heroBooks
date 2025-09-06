"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#why-local", label: "Why Local" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          heroBooks
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                pathname === n.href && "text-foreground"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
          {/* Preselect the popular plan on sign-up */}
          <Button asChild size="sm">
            <Link href="/get-started">Get started</Link>
          </Button>
        </div>
      </div>
      <div className="w-full bg-primary/10 border-t">
        <div className="container mx-auto px-4 py-2 text-xs sm:text-sm text-center">
          🎉 Early adopters: 2 months <b>50% off</b> on Business plan. Use code <b>GYA-LAUNCH</b> at checkout.
        </div>
      </div>
    </header>
  );
}
