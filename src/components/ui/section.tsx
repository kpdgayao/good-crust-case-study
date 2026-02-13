export function SectionHead({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h1 className="font-display text-[28px] font-bold mb-1.5">{title}</h1>
      <p className="text-text-muted text-sm max-w-[700px]">{description}</p>
    </div>
  );
}

export function Subsection({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 mb-3.5 text-base font-semibold font-display">
      {children}
    </h2>
  );
}

export function Callout({
  variant = "amber",
  children,
}: {
  variant?: "amber" | "red" | "green" | "accent";
  children: React.ReactNode;
}) {
  const borderColor = {
    amber: "border-l-gc-amber",
    red: "border-l-gc-red",
    green: "border-l-gc-green",
    accent: "border-l-accent",
  }[variant];

  return (
    <div
      className={`bg-surface border border-border border-l-[3px] ${borderColor} rounded-gc p-3.5 mt-4 text-xs text-text-muted`}
    >
      {children}
    </div>
  );
}
