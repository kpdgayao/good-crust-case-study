import { cn } from "@/lib/utils";

type Variant = "red" | "green" | "amber" | "accent" | "purple" | "cyan" | "orange";

const variants: Record<Variant, string> = {
  red: "bg-gc-red-dim text-gc-red",
  green: "bg-gc-green-dim text-gc-green",
  amber: "bg-gc-amber-dim text-gc-amber",
  accent: "bg-accent-glow text-accent",
  purple: "bg-gc-purple-dim text-gc-purple",
  cyan: "bg-gc-cyan-dim text-gc-cyan",
  orange: "bg-gc-orange-dim text-gc-orange",
};

export function Badge({
  variant = "accent",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded text-[10px] font-semibold font-mono",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function FillRateBadge({ rate }: { rate: number }) {
  const variant = rate >= 96 ? "green" : rate >= 93 ? "amber" : "red";
  return <Badge variant={variant}>{rate.toFixed(1)}%</Badge>;
}
