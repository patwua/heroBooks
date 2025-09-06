"use client";

export default function KpiTiles({ items }: { items: { label: string; value: number | string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((k) => (
        <div key={k.label} className="p-3 border rounded">
          <div className="text-xs text-muted-foreground">{k.label}</div>
          <div className="text-lg font-semibold">
            {typeof k.value === "number"
              ? k.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
              : k.value}
          </div>
        </div>
      ))}
    </div>
  );
}
