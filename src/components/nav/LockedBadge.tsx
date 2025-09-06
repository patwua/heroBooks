export default function LockedBadge({ reason }: { reason: string }) {
  return (
    <span className="ml-2 text-xs text-muted-foreground">{reason}</span>
  );
}
