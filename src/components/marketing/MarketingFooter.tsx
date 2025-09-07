import Link from "next/link";

export default function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-background text-sm">
      <div className="container mx-auto grid gap-8 px-4 py-10 sm:grid-cols-5">
        <div>
          <div className="mb-2 font-semibold">Product</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/#features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/demo" className="hover:underline">
                Demo
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="hover:underline">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="https://status.herobooks.gy" className="hover:underline">
                Status
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Company</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/leadership" className="hover:underline">
                Leadership
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:underline">
                Careers (coming soon)
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Resources</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/docs" className="hover:underline">
                Docs/Guides
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:underline">
                News (WaterNewsGY)
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                Blog (Patwua)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Legal</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="/legal/privacy" className="hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:underline">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/data-processing" className="hover:underline">
                Data Processing
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="hover:underline">
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

