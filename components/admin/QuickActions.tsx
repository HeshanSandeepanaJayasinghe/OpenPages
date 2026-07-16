"use client";

import Link from "next/link";
import { BarChart3, BookOpen, RefreshCw, Settings } from "lucide-react";

interface QuickActionsProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

export function QuickActions({ onRefresh, refreshing }: QuickActionsProps) {
  const actions = [
    {
      href: "/management",
      label: "Management hub",
      description: "Users, posts & moderation",
      icon: Settings,
    },
    {
      href: "/stat",
      label: "Site statistics",
      description: "Legacy analytics page",
      icon: BarChart3,
    },
    {
      href: "/pages",
      label: "Public library",
      description: "Browse published pages",
      icon: BookOpen,
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Quick actions</h2>
          <p className="mt-1 text-sm text-ink-gray">Jump to common admin workflows.</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-paper-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-gray transition hover:border-accent-ink/30 hover:text-accent-ink disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : undefined} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-xl border border-paper-border bg-paper p-4 transition hover:border-accent-ink/30 hover:shadow-paper"
            >
              <div className="mb-3 inline-flex rounded-full bg-accent-ink/10 p-2 text-accent-ink">
                <Icon size={16} />
              </div>
              <p className="text-sm font-semibold text-ink">{action.label}</p>
              <p className="mt-1 text-xs text-ink-gray">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
