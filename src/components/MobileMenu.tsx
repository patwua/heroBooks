"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { recordFeatureImpression } from "@/lib/telemetry";

export default function MobileMenu({
  open,
  onClose,
  anchorLinks,
}: {
  open: boolean;
  onClose: () => void;
  anchorLinks: { href: string; label: string }[];
}) {
  const handleClick = (label: string, href: string) => () => {
    recordFeatureImpression({ feature: "nav_click", reason: label, path: href });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-80 max-w-[85%] transform bg-white p-5 shadow-xl transition-transform dark:bg-neutral-900 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-base font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="grid gap-3">
          {anchorLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleClick(l.label, l.href)}
              className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/about"
            onClick={handleClick("About", "/about")}
            className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            About
          </Link>
          <Link
            href="/partners"
            onClick={handleClick("Partners", "/partners")}
            className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Partners
          </Link>
          <Link
            href="/contact"
            onClick={handleClick("Contact", "/contact")}
            className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Talk to us
          </Link>
          <Link
            href="/legal"
            onClick={handleClick("Legal", "/legal")}
            className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Terms & Privacy
          </Link>
        </nav>
      </aside>
    </div>
  );
}
