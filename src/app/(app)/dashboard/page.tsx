import { Card } from "@/components/ui/card";
export default function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card><div className="text-sm text-slate-400">Customers</div><div className="mt-2 text-2xl font-semibold">0</div></Card>
      <Card><div className="text-sm text-slate-400">Invoices</div><div className="mt-2 text-2xl font-semibold">0</div></Card>
      <Card><div className="text-sm text-slate-400">Bills</div><div className="mt-2 text-2xl font-semibold">0</div></Card>
    </div>
  );
}
