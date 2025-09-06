import Link from "next/link";
import { normalizePlan, type Plan } from "@/lib/plans";

export default function SignUpPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const raw = Array.isArray(searchParams?.plan) ? searchParams.plan[0] : searchParams?.plan ?? null;
  const initialPlan: Plan = normalizePlan(raw);
  const demo = (Array.isArray(searchParams?.demo) ? searchParams.demo[0] : searchParams?.demo) === "1";

  const planPretty = initialPlan === "starter" ? "Starter"
    : initialPlan === "business" ? "Business"
    : "Enterprise";

  // Build "change plan" link back to pricing, preserving flow to come back here
  const changePlanHref = `/pricing?next=/sign-up&highlight=${initialPlan}`;

  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      {/* Plan summary band */}
      <div className="rounded-md border bg-muted/40 p-3 text-sm flex items-center justify-between">
        <div>
          Selected plan: <b>{planPretty}</b>
        </div>
        <Link href={changePlanHref} className="underline text-muted-foreground">Change</Link>
      </div>

      <h1 className="text-2xl font-semibold mt-4">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Start with the plan that fits—change anytime.{" "}
        <a className="underline" href="/sign-in">Already have an account? Sign in</a>
      </p>

      <form action="/api/auth/register" method="POST" className="mt-6 space-y-4">
        {/* your existing plan radios (optional), fields, etc. */}
        <input type="hidden" name="plan" value={initialPlan} />
        {demo && <input type="hidden" name="demo" value="1" />}

        {/* Email */}
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input name="email" type="email" required className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="you@company.gy" />
        </div>
        {/* Password */}
        <div className="grid gap-2">
          <label className="text-sm">Password</label>
          <input name="password" type="password" required className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="••••••••" />
        </div>

        <button className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium">
          Create account
        </button>

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our <a className="underline" href="/legal/terms">Terms</a> and <a className="underline" href="/legal/privacy">Privacy Policy</a>.
        </p>
      </form>
    </section>
  );
}
