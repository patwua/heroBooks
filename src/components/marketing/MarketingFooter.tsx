import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold mb-2">Product</div>
          <ul className="space-y-1">
            <li><Link href="/#features" className="text-muted-foreground hover:underline">Features</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:underline">Pricing</Link></li>
            <li><Link href="/help" className="text-muted-foreground hover:underline">Help</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1">
            <li><Link href="/contact" className="text-muted-foreground hover:underline">Contact</Link></li>
            <li><Link href="/legal/terms" className="text-muted-foreground hover:underline">Terms</Link></li>
            <li><Link href="/legal/privacy" className="text-muted-foreground hover:underline">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Built for Guyana</div>
          <p className="text-muted-foreground">VAT, NIS & PAYE made simple. Local support, familiar practices, fast invoicing.</p>
        </div>
      </div>
      <div className="border-t py-4 text-xs text-muted-foreground text-center">© {new Date().getFullYear()} heroBooks</div>
    </footer>
  );
}
