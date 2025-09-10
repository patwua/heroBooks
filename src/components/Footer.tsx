import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

export default async function Footer() {
  const session = await auth().catch(() => null);
  const linkProps = session
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
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
                <Link href="/#pricing" {...linkProps} className="hover:underline">
                  Pricing
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
                <Link href="/about#contact-form" {...linkProps} className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Resources</div>
            <ul className="space-y-1 text-neutral-300">
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
                <Link href="/legal" {...linkProps} className="hover:underline">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-semibold">Contact Us</div>
            <ul className="space-y-1 text-neutral-300">
              <li>
                <Link href="/about#contact-form" className="hover:underline">
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-300">
            <Image src="/logos/heroBooks%20mini%20Color.webp" alt="heroBooks" width={80} height={80} className="h-16 w-auto" />
            <span>© 2025 heroBooks. Built for businesses in Guyana.</span>
          </div>
          <div />
        </div>
      </div>
    </footer>
  );
}





