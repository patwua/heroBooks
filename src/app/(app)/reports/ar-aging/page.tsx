import { fmtMoney } from "@/lib/format";

export default async function ArAgingPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reports/ar-aging`, {
    cache: "no-store"
  });
  const data = await res.json();
  return (
    <div>
      <h1 className="text-xl mb-4">A/R Aging</h1>
      <ul>
        <li>Current: {fmtMoney(data.current || 0)}</li>
        <li>31-60: {fmtMoney(data["31-60"] || 0)}</li>
        <li>61-90: {fmtMoney(data["61-90"] || 0)}</li>
        <li>90+: {fmtMoney(data["90+"] || 0)}</li>
      </ul>
    </div>
  );
}
