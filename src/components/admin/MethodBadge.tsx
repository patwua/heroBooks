export default function MethodBadge({ method }: { method: string | null }) {
  if (!method) return <span className="text-xs text-muted-foreground">—</span>;
  return <span className="inline-block text-xs capitalize">{method}</span>;
}
