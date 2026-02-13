"use client";

export function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-mono text-text-dim uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-2 border border-border text-text text-sm rounded-gc-sm px-2.5 py-1.5 font-mono focus:outline-none focus:border-accent"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
