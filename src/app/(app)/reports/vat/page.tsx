import { fmtMoney } from "@/lib/format";

export default async function VatPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/vat-summary`, {
    cache: "no-store"
  });
  const data = await res.json();
  return (
    <div>
      <h1 className="text-xl mb-4">VAT Summary</h1>
      <table className="text-left">
        <thead>
          <tr>
            <th>Tax Code</th>
            <th>VAT Collected</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([code, amount]) => (
            <tr key={code} className="border-t">
              <td>{code}</td>
              <td>{fmtMoney(amount as number)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
