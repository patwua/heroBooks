import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Get Started — heroBooks" };

export default function GetStartedPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Get started</h1>
      <p className="text-muted-foreground mt-2">Choose how you’d like to begin.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 flex flex-col">
          <div className="text-lg font-medium">Create account</div>
          <p className="text-sm text-muted-foreground mt-1">
            Start fresh with your company file. You can invite your accountant any time.
          </p>
          <Button asChild className="mt-auto">
            <Link href="/sign-up">Create account</Link>
          </Button>
        </div>

        <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col">
          <div className="text-lg font-medium">Explore demo</div>
          <p className="text-sm text-muted-foreground mt-1">
            See heroBooks with sample data. Requires a login so we can tailor help later.
          </p>
          {/* Preselect Business plan; add demo=1 so signup hands users into demo after registration */}
          <Button asChild className="mt-auto">
            <Link href="/sign-up?plan=business&demo=1">Try the demo</Link>
          </Button>
          <span className="text-xs text-muted-foreground mt-2">No credit card needed.</span>
        </div>
      </div>
    </section>
  );
}

