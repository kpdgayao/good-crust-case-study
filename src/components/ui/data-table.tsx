import { cn } from "@/lib/utils";

export function DataTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-xs bg-surface rounded-gc overflow-hidden border border-border",
          className
        )}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
  align,
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <th
      className={cn(
        "px-3 py-2.5 font-semibold text-text-muted bg-surface-2 border-b-2 border-border font-mono text-[10px] uppercase tracking-wider",
        align === "right" && "text-right",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  align,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-3 py-2 border-b border-border font-mono text-[11px]",
        align === "right" && "text-right",
        className
      )}
    >
      {children}
    </td>
  );
}
