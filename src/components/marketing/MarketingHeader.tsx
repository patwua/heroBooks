"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#why-local", label: "Why Local" },
  { href: "/contact", label: "Contact" },
];

export default function MarketingHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/heroBooks mini Color.png"
              alt="heroBooks"
              width={24}
              height={24}
            />
            <span className="font-semibold tracking-tight">heroBooks</span>
          </Link>
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={
                pathname === n.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href="/sign-in"
            className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
          >
            Sign in
          </Link>
          <Button asChild>
            <Link href="/pricing#starter">Start free trial</Link>
          </Button>
        </div>
      </div>
      <div className="w-full border-t bg-primary/10">
        <div className="container mx-auto px-4 py-2 text-center text-xs sm:text-sm">
          🎉 Early adopters: 2 months <b>50% off</b> on Business plan. Use code
          <b> GYA-LAUNCH</b>.
        </div>
      </div>
    </header>
  );
}
