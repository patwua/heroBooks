import Link from "next/link";
import { Button } from "@/components/ui/button";
import DemoEnterButton from "@/components/marketing/DemoEnterButton";

export const metadata = { title: "Get Started — heroBooks" };

export default function GetStartedPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Get started</h1>
      <p className="text-muted-foreground mt-2">Choose how you’d like to begin.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 flex flex-col">
          <div className="text-lg font-medium">Create account</div>
          <p className="text-sm text-muted-foreground mt-1">Start fresh with your company file. Compare plans first.</p>
          {/* Route via pricing comparison, then onward to sign-up after selection */}
          <Button asChild className="mt-auto">
            <Link href="/pricing?next=/sign-up">Compare plans & sign up</Link>
          </Button>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col">
          <div className="text-lg font-medium">Explore demo</div>
          <p className="text-sm text-muted-foreground mt-1">
            See heroBooks with sample data (login required so we can help you later).
          </p>
          <div className="mt-auto">
            <DemoEnterButton label="Explore the demo" />
          </div>
          <span className="text-xs text-muted-foreground mt-2">No credit card needed.</span>
        </div>
      </div>
    </section>
  );
}

