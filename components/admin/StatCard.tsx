"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
}

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : "bg-accent-ink/10 text-accent-ink";

  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <div className={`rounded-full p-2 ${toneClass}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-3xl font-bold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-gray">{hint}</p> : null}
    </div>
  );
}
