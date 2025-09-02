export default function StatusBadge({ status }: { status: string }) {
  return <span className="inline-block rounded bg-accent px-2 py-0.5 text-xs capitalize">{status}</span>;
}
