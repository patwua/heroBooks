import { cn } from "@/lib/utils";

export default function FeatureCard({
  title,
  desc,
  icon,
  className,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground mt-1">{desc}</div>
        </div>
      </div>
    </div>
  );
}
