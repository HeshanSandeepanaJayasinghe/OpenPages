"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { RecentPageRow } from "@/lib/adminDashboard";
import { DashboardEmpty } from "@/components/admin/DashboardStates";

interface RecentPagesTableProps {
  rows: RecentPageRow[];
}

export function RecentPagesTable({ rows }: RecentPagesTableProps) {
  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Recent pages</h2>
          <p className="mt-1 text-sm text-ink-gray">Latest drafts and published work across the community.</p>
        </div>
        <Link href="/management" className="text-xs font-semibold uppercase tracking-wider text-accent-ink hover:underline">
          View all →
        </Link>
      </div>

      {rows.length === 0 ? (
        <DashboardEmpty
          title="No pages to show"
          description="When writers create pages, they will appear in this table."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-paper-border text-xs uppercase tracking-wider text-ink-gray">
                <th className="pb-3 pr-3 font-semibold">Page</th>
                <th className="pb-3 pr-3 font-semibold">Author</th>
                <th className="pb-3 pr-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Activity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-paper-border/70 last:border-0">
                  <td className="py-3 pr-3">
                    <Link href={`/pages/${row.id}`} className="font-semibold text-ink hover:text-accent-ink">
                      {row.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-gray">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      {row.authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.authorAvatar}
                          alt=""
                          className="h-7 w-7 rounded-full border border-paper-border object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-ink/10 text-[10px] font-bold text-accent-ink">
                          {row.authorName.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="text-ink-gray">{row.authorName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        row.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-ink-gray">
                      <MessageSquare size={13} />
                      {row.commentCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
