export function AgingList({ title, buckets }: { title: string; buckets: { label: string; amount: number }[] }) {
  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="text-sm font-medium mb-3">{title}</div>
      <ul className="space-y-2">
        {buckets.map((b) => (
          <li key={b.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{b.label}</span>
            <span className="font-medium">{b.amount.toLocaleString(undefined, { style: "currency", currency: "USD" })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
