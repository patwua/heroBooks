import { fmtMoney } from "@/lib/format";

export default async function VatReportPage() {
  const res = await fetch("/api/reports/vat-summary", {
    cache: "no-store",
  });
  if (!res.ok) {
    const message = await res.text();
    return <div>{message || "Failed to fetch VAT summary"}</div>;
  }
  const data = await res.json();
  return (
    <div>
      <h1 className="text-xl mb-4">VAT Summary</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded">
          <div className="font-semibold">Output VAT</div>
          <div>{fmtMoney(data.outputVat)}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Input VAT</div>
          <div>{fmtMoney(data.inputVat)}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="font-semibold">Net VAT</div>
          <div>{fmtMoney(data.netVat)}</div>
        </div>
      </div>
    </div>
  );
}
