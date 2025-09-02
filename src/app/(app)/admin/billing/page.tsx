import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import StatusBadge from "@/components/admin/StatusBadge";
import MethodBadge from "@/components/admin/MethodBadge";
import IntentRowActions from "@/components/admin/IntentRowActions";
import Link from "next/link";

type SearchParams = { q?: string; status?: string; method?: string; page?: string };

export const metadata = { title: "Admin · Billing — heroBooks" };

export default async function AdminBillingPage({ searchParams }: { searchParams: SearchParams }) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return (
      <section className="p-6">
        <h1 className="text-xl font-semibold">Admin · Billing</h1>
        <p className="text-sm text-muted-foreground mt-2">Access denied ({gate.reason}).</p>
      </section>
    );
  }

  const q = (searchParams.q ?? "").trim();
  const status = searchParams.status ?? "all";
  const method = searchParams.method ?? "all";
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const pageSize = 20;

  const where: any = {};
  if (status !== "all") where.status = status;
  if (method !== "all") where.paymentMethod = method;
  if (q) {
    where.OR = [
      { id: { contains: q } },
      { externalRef: { contains: q } },
      { plan: { contains: q } },
      { user: { email: { contains: q } } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.checkoutIntent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.checkoutIntent.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin · Billing</h1>
        <Link href="/pricing" className="text-sm underline text-muted-foreground">View pricing</Link>
      </div>

      {/* Filters */}
      <form className="grid gap-3 sm:grid-cols-4">
        <input
          name="q"
          defaultValue={q}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Search (id, externalRef, plan, email)"
        />
        <select name="status" defaultValue={status} className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="created">Created</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select name="method" defaultValue={method} className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="all">All methods</option>
          <option value="paypal">PayPal</option>
          <option value="zelle">Zelle</option>
          <option value="mmg">MMG</option>
          <option value="bank">Bank</option>
        </select>
        <button className="rounded-md bg-primary text-primary-foreground text-sm px-4">Filter</button>
      </form>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Intent</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Plan</th>
              <th className="text-left p-2">Amount (GYD)</th>
              <th className="text-left p-2">Discount</th>
              <th className="text-left p-2">Method</th>
              <th className="text-left p-2">External Ref</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2 font-mono text-xs">{r.id}</td>
                <td className="p-2">
                  <div className="flex flex-col">
                    <span>{r.user?.name ?? "—"}</span>
                    <span className="text-xs text-muted-foreground">{r.user?.email ?? "—"}</span>
                  </div>
                </td>
                <td className="p-2 capitalize">{r.plan}</td>
                <td className="p-2">GYD ${r.amount.toLocaleString()}</td>
                <td className="p-2">GYD ${r.discount.toLocaleString()}</td>
                <td className="p-2"><MethodBadge method={r.paymentMethod ?? null} /></td>
                <td className="p-2 font-mono text-xs">{r.externalRef ?? "—"}</td>
                <td className="p-2"><StatusBadge status={r.status} /></td>
                <td className="p-2">
                  {/* Only show manual actions for non-PayPal or unpaid */}
                  {r.status !== "paid" ? <IntentRowActions id={r.id} /> : <span className="text-xs text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-sm text-muted-foreground">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">Total: {total}</div>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
            const active = p === page;
            const qs = new URLSearchParams({ q, status, method, page: String(p) }).toString();
            return (
              <Link
                key={p}
                href={`/admin/billing?${qs}`}
                className={`px-2 py-1 rounded border ${active ? "bg-primary text-primary-foreground" : "bg-background"}`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
