"use client";

import { Star } from "lucide-react";
import type { TopWriterRow } from "@/lib/adminDashboard";
import { DashboardEmpty } from "@/components/admin/DashboardStates";

interface TopWritersProps {
  writers: TopWriterRow[];
  roleMix: { writers: number; admins: number };
}

export function TopWriters({ writers, roleMix }: TopWritersProps) {
  const totalRoles = roleMix.writers + roleMix.admins;
  const writerPct = totalRoles === 0 ? 0 : Math.round((roleMix.writers / totalRoles) * 100);
  const adminPct = totalRoles === 0 ? 0 : 100 - writerPct;

  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <h2 className="text-lg font-semibold text-ink">Community mix</h2>
      <p className="mt-1 text-sm text-ink-gray">Role balance and most active published authors.</p>

      <div className="mt-5 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs font-semibold text-ink">
            <span>Writers ({roleMix.writers})</span>
            <span>{writerPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-paper-dark">
            <div className="h-full rounded-full bg-accent-ink" style={{ width: `${writerPct}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs font-semibold text-ink">
            <span>Admins ({roleMix.admins})</span>
            <span>{adminPct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-paper-dark">
            <div className="h-full rounded-full bg-[#c4a574]" style={{ width: `${adminPct}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-paper-border pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-gray">Top writers</p>
        {writers.length === 0 ? (
          <DashboardEmpty
            title="No writers yet"
            description="Published authors will rank here by post count."
          />
        ) : (
          <ul className="space-y-3">
            {writers.map((writer, index) => (
              <li
                key={writer.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-paper-border bg-paper p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {writer.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={writer.avatarUrl}
                      alt=""
                      className="h-9 w-9 rounded-full border border-paper-border object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink/10 text-xs font-bold text-accent-ink">
                      {writer.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{writer.name}</p>
                    <p className="text-xs text-ink-gray">{writer.publishedCount} posts published</p>
                  </div>
                </div>
                {index === 0 ? (
                  <span className="rounded-full bg-amber-50 p-1.5 text-amber-600">
                    <Star size={14} fill="currentColor" />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
