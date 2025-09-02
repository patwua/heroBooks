import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import StatusBadge from "@/components/admin/StatusBadge";
import MethodBadge from "@/components/admin/MethodBadge";
import IntentRowActions from "@/components/admin/IntentRowActions";

export default async function AdminBillingPage() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return <div className="p-4 text-sm">Access denied</div>;
  }

  const rows = await prisma.checkoutIntent.findMany({
    where: {
      user: { memberships: { some: { orgId: gate.orgId } } },
    },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4">
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
              <th className="text-left p-2">Sub?</th>
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
                  {r.status === "paid" ? (
                    <span className="text-xs">Created</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-2">
                  {r.status !== "paid" ? <IntentRowActions id={r.id} /> : <span className="text-xs text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
