import { normalizePlan, type Plan } from "@/lib/plans";

export default function SignUpPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const raw = Array.isArray(searchParams?.plan) ? searchParams.plan[0] : searchParams?.plan ?? null;
  const initialPlan: Plan = normalizePlan(raw);

  // NOTE: Replace this with your real sign-up form; we show a simple scaffold with plan pre-selected.
  // If you already have a form, just add:
  //  - a "plan" radio group with defaultValue={initialPlan}
  //  - a hidden input <input type="hidden" name="plan" value={selected} />
  // and include it in your registration POST.
  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1">Start with the plan that fits—change anytime.</p>

      <form action="/api/auth/register" method="POST" className="mt-6 space-y-4">
        {/* Plan picker */}
        <fieldset className="rounded-lg border p-4">
          <legend className="text-sm font-medium px-1">Plan</legend>
          <div className="mt-2 grid gap-2">
            {( ["starter", "business", "enterprise"] as Plan[]).map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="plan_choice"
                  value={p}
                  defaultChecked={p === initialPlan}
                />
                <span className="capitalize">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Hidden input actually submitted as "plan" (use plan_choice radio above for UX) */}
        <input type="hidden" name="plan" value={initialPlan} />

        {/* Your existing fields */}
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="you@company.gy"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="••••••••"
          />
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
