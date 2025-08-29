import Link from "next/link";
import { fmtMoney, fmtDate } from "@/lib/format";

export default async function InvoicesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoices`, {
    cache: "no-store"
  });
  const invoices = await res.json();

  return (
    <div>
      <h1 className="text-xl mb-4">Invoices</h1>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Number</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv: any) => (
            <tr key={inv.id} className="border-t">
              <td>{inv.number}</td>
              <td>{fmtDate(inv.issueDate)}</td>
              <td>{fmtMoney(inv.total)}</td>
              <td>{inv.status}</td>
              <td>
                <Link href={`/api/invoices/${inv.id}/pdf`} target="_blank">
                  View PDF
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
