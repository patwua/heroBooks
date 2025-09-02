import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-semibold">heroBooks</div>
          <p className="text-sm text-muted-foreground mt-2">
            Local-first accounting for Guyana. VAT, PAYE, NIS—handled.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Product</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            <li><Link href="/#why-local" className="text-muted-foreground hover:text-foreground">Why Local</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
            <li><Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Developers</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/sign-up" className="text-muted-foreground hover:text-foreground">Get API access</Link></li>
            <li><span className="text-muted-foreground">Docs (coming soon)</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} heroBooks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
