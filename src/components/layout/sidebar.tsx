"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GitBranch,
  Network,
  Database,
  Scale,
  Truck,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/process-flow", label: "Process Flow", prompt: "1A", icon: GitBranch },
  { href: "/architecture", label: "Architecture", prompt: "1B", icon: Network },
  { href: "/data-model", label: "Data Model", prompt: "1B", icon: Database },
  { href: "/reconciliation", label: "Reconciliation", prompt: "2.1", icon: Scale },
  { href: "/tpl-metrics", label: "3PL Metrics", prompt: "2.2", icon: Truck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-surface border-r border-border flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-accent to-gc-purple flex items-center justify-center text-xs font-bold text-white font-mono">
            GC
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-tight">
              GoodCrust Foods
            </div>
            <div className="text-[10px] text-text-dim font-mono">
              DOSS ERP Analysis
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-gc-sm text-xs font-medium transition-all",
                active
                  ? "bg-accent text-white shadow-md shadow-accent/30"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              <Icon size={15} />
              <span className="flex-1">{item.label}</span>
              {item.prompt && (
                <span className="text-[8px] font-mono opacity-50">
                  {item.prompt}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="text-[10px] text-text-dim font-mono text-center">
          Jan 1 &ndash; Mar 1, 2025
        </div>
      </div>
    </aside>
  );
}
