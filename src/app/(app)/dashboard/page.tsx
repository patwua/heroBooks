import KpiCard from "@/components/dashboard/KpiCard";
import { AgingList } from "@/components/dashboard/AgingList";
// Placeholder server "queries"
async function getDashboardData() {
  // TODO: replace with real Prisma queries using getActiveOrgId()
  return {
    arTotal: 15230,
    apTotal: 9680,
    vatDue: 2240,
    arAging: [
      { label: "Current", amount: 8200 },
      { label: "1–30d", amount: 4200 },
      { label: "31–60d", amount: 630 },
      { label: "61–90d", amount: 200 },
      { label: "90d+", amount: 0 },
    ],
    apAging: [
      { label: "Current", amount: 6000 },
      { label: "1–30d", amount: 2500 },
      { label: "31–60d", amount: 900 },
      { label: "61–90d", amount: 280 },
      { label: "90d+", amount: 0 },
    ],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
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
    </div>
  );
}
