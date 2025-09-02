const map: Record<string, string> = {
  paypal: "PayPal",
  zelle: "Zelle",
  mmg: "MMG",
  bank: "Bank",
};

export default function MethodBadge({ method }: { method: string | null }) {
  const label = method ? map[method] ?? method : "—";
  return <span className="px-2 py-0.5 rounded text-xs border bg-card">{label}</span>;
}
