"use client";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchExpand from "@/components/SearchExpand";

const anchorLinks = [
  { href: "#features", label: "Features" },
  { href: "#why-local", label: "Why Local" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function StickyNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="heroBooks Home">
          <Image
            src="/logos/heroBook%20Full%20Color.svg"
            alt="heroBooks"
            width={140}
            height={28}
            priority
          />
        </Link>
        <div className="ml-6 hidden flex-1 items-center justify-center md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {anchorLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SearchExpand />
          <Link
            href="#"
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>
          <button
            className="flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Account menu"
          >
            <User className="h-5 w-5" />
            <ChevronDown className="h-4 w-4" />
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
