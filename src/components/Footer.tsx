import Link from "next/link";

interface FooterProps {
  authenticated?: boolean;
}

export default function Footer({ authenticated = false }: FooterProps) {
  const year = new Date().getFullYear();
  const linkProps = authenticated
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
  return (
    <footer className="border-t bg-background text-sm">
      <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-5">
        <div>
          <div className="mb-2 font-semibold">Product</div>
          <ul className="space-y-1 text-muted-foreground">
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
            <li>
              <Link href="/changelog" {...linkProps} className="hover:underline">
                Changelog
              </Link>
            </li>
            <li>
              <Link
                href="https://status.herobooks.gy"
                {...linkProps}
                className="hover:underline"
              >
                Status
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Company</div>
          <ul className="space-y-1 text-muted-foreground">
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
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/docs" {...linkProps} className="hover:underline">
                Docs/Guides
              </Link>
            </li>
            <li>
              <Link href="/help" {...linkProps} className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/news" {...linkProps} className="hover:underline">
                News (WaterNewsGY)
              </Link>
            </li>
            <li>
              <Link href="/blog" {...linkProps} className="hover:underline">
                Blog (Patwua)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Legal</div>
          <ul className="space-y-1 text-muted-foreground">
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
            <li>
              <Link
                href="/legal/data-processing"
                {...linkProps}
                className="hover:underline"
              >
                Data Processing
              </Link>
            </li>
            <li>
              <Link
                href="/legal/cookies"
                {...linkProps}
                className="hover:underline"
              >
                Cookies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Contact</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <a href="mailto:support@herobooks.gy" className="hover:underline">
                support@herobooks.gy
              </a>
            </li>
            <li>Georgetown, Guyana</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {year} heroBooks. Built for businesses in Guyana.
      </div>
    </footer>
  );
}

