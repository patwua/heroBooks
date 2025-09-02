export default function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : status === "failed"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : status === "cancelled"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      : status === "processing"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : "bg-muted text-muted-foreground";
  return <span className={`px-2 py-0.5 rounded text-xs capitalize ${cls}`}>{status}</span>;
}
