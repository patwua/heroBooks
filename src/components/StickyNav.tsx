"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, User, ChevronDown, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchExpand from "@/components/SearchExpand";
import MobileMenu from "@/components/MobileMenu";
import { useEffect, useState } from "react";
import { recordFeatureImpression } from "@/lib/telemetry";

const anchorLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#why-local", label: "Why Local" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function StickyNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scrollspy for landing sections
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = anchorLinks.map((a) => a.href.split("#")[1]);
    const els = ids
      .map((id) => (typeof document !== "undefined" ? document.getElementById(id) : null))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.6] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const onNavClick = (label: string, href: string) => () =>
    recordFeatureImpression({ feature: "nav_click", reason: label, path: href });

  if (status === "loading" || status === "pending") {
    return (
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/70">
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <span className="sr-only">Loading navigation...</span>
        </nav>
      </header>
    );
  }

  const homeHref = session ? "/dashboard" : "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-900/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
          className="flex items-center gap-2 shrink-0"
          aria-label="heroBooks Home"
          onClick={onNavClick("Home", homeHref)}
        >
          <Image
            src="/logos/heroBook%20Full%20Color.svg"
            alt="heroBooks"
            width={140}
            height={28}
            priority
          />
        </Link>

        <div className="ml-2 md:ml-6 hidden flex-1 items-center justify-center md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {anchorLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={onNavClick(l.label, l.href)}
                  className={`transition-colors ${
                    active && l.href.includes(active)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/about"
                onClick={onNavClick("About", "/about")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
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
          <button
            className="p-2 md:hidden rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} anchorLinks={anchorLinks} />
    </header>
  );
}
