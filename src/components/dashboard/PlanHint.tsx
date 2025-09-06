import Link from "next/link";
import { getCurrentPlanForActiveOrg } from "@/lib/subscriptions/current-plan";
import UpgradeCta from "./UpgradeCta";

export default async function PlanHint() {
  const plan = await getCurrentPlanForActiveOrg();
  const isStarter =
    plan === "starter" || plan === "none" || plan === "pending_assignment";

  if (isStarter) {
    return (
      <div className="rounded-xl border bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200 p-4 flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs">
          ✓
        </div>
        <div className="text-sm">
          <div className="font-medium">
            Upgrade to unlock VAT automation & Bank Reconcile
          </div>
          <div className="text-emerald-900/80 dark:text-emerald-200/80">
            Business includes PAYE/NIS summaries, custom branding, and
            priority support.
          </div>
        </div>
        <div className="ml-auto">
          <UpgradeCta />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-muted/40 p-4 text-sm flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">i</div>
      <div>
        <div className="font-medium">Most features are free on Starter</div>
        <div className="text-muted-foreground">
          Compare plans anytime — you’re on <b>{plan}</b>.
        </div>
      </div>
      <div className="ml-auto">
        <Link
          href="/pricing?highlight=business"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          View pricing
        </Link>
      </div>
    </div>
  );
}

