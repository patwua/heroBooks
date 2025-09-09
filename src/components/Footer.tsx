import Link from "next/link";
import { auth } from "@/auth";

export default async function Footer() {
  const session = await auth().catch(() => null);
  const linkProps = session
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
  const externalTarget = session ? "_blank" : undefined;
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <div className="mb-2 font-semibold">Product</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <Link href="/#features" {...linkProps} className="hover:underline">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" {...linkProps} className="hover:underline">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" {...linkProps} className="hover:underline">
                  Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Company</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <Link href="/about" {...linkProps} className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/leadership" {...linkProps} className="hover:underline">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/careers" {...linkProps} className="hover:underline">
                  Careers (coming soon)
                </Link>
              </li>
              <li>
                <Link href="/contact" {...linkProps} className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Resources</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <Link href="/kb" {...linkProps} className="hover:underline">
                  Docs/Guides
                </Link>
              </li>
              <li>
                <Link href="/help" {...linkProps} className="hover:underline">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Legal</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <Link
                  href="/legal/privacy"
                  {...linkProps}
                  className="hover:underline"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  {...linkProps}
                  className="hover:underline"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Contact</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <a href="mailto:support@herobooks.gy" className="hover:underline">
                  support@herobooks.gy
                </a>
              </li>
              <li>Georgetown, Guyana</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-neutral-300">© 2025 heroBooks. Built for businesses in Guyana.</p>
          <a href="mailto:support@herobooks.gy" className="hover:underline" target={externalTarget}>
            support@herobooks.gy
          </a>
        </div>
      </div>
    </footer>
  );
}

