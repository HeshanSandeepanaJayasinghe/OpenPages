"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import type { ModerationPulseItem } from "@/lib/adminDashboard";
import { DashboardEmpty } from "@/components/admin/DashboardStates";

interface ModerationPulseProps {
  items: ModerationPulseItem[];
  flaggedCount: number;
  totalCount: number;
}

export function ModerationPulse({ items, flaggedCount, totalCount }: ModerationPulseProps) {
  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Moderation pulse</h2>
          <p className="mt-1 text-sm text-ink-gray">
            {flaggedCount} flagged · {totalCount} total events
          </p>
        </div>
        <Link href="/management" className="text-xs font-semibold uppercase tracking-wider text-accent-ink hover:underline">
          Review →
        </Link>
      </div>

      {items.length === 0 ? (
        <DashboardEmpty
          title="No moderation events"
          description="Comment moderation outcomes will show up here as readers engage."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-paper-border bg-paper p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{item.result}</p>
                <p className="text-xs text-ink-gray">
                  {item.targetType} · {item.targetId}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.flagged
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <Shield size={11} />
                  {item.flagged ? "Flagged" : "Clean"}
                </span>
                <span className="text-[11px] text-ink-gray">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
