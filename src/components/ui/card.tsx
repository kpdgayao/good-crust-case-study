import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-gc border border-border bg-surface transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function KpiCard({
  value,
  label,
  sub,
  color = "text-accent",
}: {
  value: string;
  label: string;
  sub?: string;
  color?: string;
}) {
  return (
    <Card className="p-5 text-center">
      <div className={cn("text-4xl font-bold font-mono leading-tight", color)}>
        {value}
      </div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
      {sub && (
        <div className="text-xs text-text-dim font-mono mt-0.5">{sub}</div>
      )}
    </Card>
  );
}
