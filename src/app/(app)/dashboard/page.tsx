import KpiCard from "@/components/dashboard/KpiCard";
import { AgingList } from "@/components/dashboard/AgingList";
import { getDashboardData, getDashboardDataForOrg } from "@/lib/dashboard";
import { auth } from "@/lib/auth";
import { isDemoSession, getDemoOrgId } from "@/lib/demo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const demo = await isDemoSession(session);
  let noRealOrg = false;
  let data: Awaited<ReturnType<typeof getDashboardData>> | null = null;
  if (demo) {
    data = await getDashboardDataForOrg(await getDemoOrgId());
  } else {
    try {
      data = await getDashboardData();
    } catch {
      noRealOrg = true;
    }
  }

  return (
    <div className="space-y-6">
      {demo && (
        <div className="rounded-md border bg-amber-50 text-amber-900 p-3 text-sm">
          You’re exploring the <b>Demo company</b>. Data is temporary, settings are locked, and email sending is preview-only (or “Send to me”).
        </div>
      )}

      {noRealOrg && (
        <div className="rounded-lg border p-6 bg-card">
          <h2 className="text-lg font-semibold mb-2">Let’s get you started</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create your own company or explore the demo first. You can remove the demo later.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/settings/organization?onboard=1"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm"
            >
              Create my company
            </Link>
            <form action="/api/demo/enter" method="post">
              <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm">
                Explore demo
              </button>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}</h1>
      <p className="text-gray-600">This is your heroBooks dashboard.</p>

      {data && (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="A/R Total" value={`$${data.arTotal.toLocaleString()}`} hint="Open customer balances" />
            <KpiCard title="A/P Total" value={`$${data.apTotal.toLocaleString()}`} hint="Open vendor balances" />
            <KpiCard title="VAT Due" value={`$${data.vatDue.toLocaleString()}`} hint="Estimated current period" />
            <KpiCard title="Cash" value="$0" hint="Connect bank to see live" />
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <AgingList title="A/R Aging" buckets={data.arAging} />
            <AgingList title="A/P Aging" buckets={data.apAging} />
          </div>

          <div className="rounded-xl border p-4 bg-card">
            <div className="text-sm font-medium mb-2">Reminders</div>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>VAT filing due soon – review VAT Summary</li>
              <li>3 invoices are past due – send reminders</li>
              <li>Bank import available – reconcile this week</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
