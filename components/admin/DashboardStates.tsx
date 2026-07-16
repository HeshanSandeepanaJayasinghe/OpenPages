"use client";

import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";

export function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-8">
        <div className="mb-8 flex items-center gap-3 border-b border-paper-border pb-6">
          <Loader2 className="animate-spin text-accent-ink" size={20} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">Admin dashboard</p>
            <h1 className="book-title mt-1 text-2xl font-bold text-ink">Loading overview…</h1>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-paper-border bg-paper-dark/40"
            />
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-72 animate-pulse rounded-2xl border border-paper-border bg-paper-dark/40" />
          <div className="h-72 animate-pulse rounded-2xl border border-paper-border bg-paper-dark/40" />
        </div>
      </div>
    </div>
  );
}

export function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-700">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h1 className="book-title text-2xl font-bold text-ink">Could not load the dashboard</h1>
              <p className="mt-1 text-sm text-ink-gray">{message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-ink px-4 py-2 text-sm font-medium text-paper shadow-paper transition hover:bg-[#6b1a1a]"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-paper-border bg-paper px-4 py-10 text-center">
      <div className="mb-3 rounded-full bg-accent-ink/10 p-3 text-accent-ink">
        <Inbox size={18} />
      </div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-ink-gray">{description}</p>
    </div>
  );
}
