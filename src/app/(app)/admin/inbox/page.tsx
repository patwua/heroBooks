import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

async function createMailbox(formData: FormData) {
  'use server';
  const email = formData.get('email') as string;
  const orgId = formData.get('orgId') as string;
  if (!email || !orgId) return;
  await prisma.inboundMailbox.create({ data: { email: email.toLowerCase(), orgId } });
  revalidatePath('/app/admin/inbox');
}

export default async function InboxPage() {
  const logs = await prisma.emailIngestLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return (
    <div className="p-6 text-slate-300">
      <h1 className="mb-4 text-xl">Inbox</h1>
      <form action={createMailbox} className="mb-6 flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="Mailbox email"
          className="rounded px-2 py-1 text-black"
        />
        <input
          type="text"
          name="orgId"
          placeholder="Org ID"
          className="rounded px-2 py-1 text-black"
        />
        <button type="submit" className="rounded bg-slate-700 px-3 py-1">
          Add
        </button>
      </form>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-1">Vendor</th>
            <th className="px-2 py-1">Status</th>
            <th className="px-2 py-1">Bill</th>
            <th className="px-2 py-1">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-slate-700">
              <td className="px-2 py-1">{log.vendor || '-'}</td>
              <td className="px-2 py-1">{log.status}</td>
              <td className="px-2 py-1">
                {log.billId ? (
                  <Link href={`/app/purchases/bills/${log.billId}`}>View</Link>
                ) : (
                  '-' )}
              </td>
              <td className="px-2 py-1">
                {log.createdAt?.toISOString?.() ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
