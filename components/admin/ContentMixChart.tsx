"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ContentMixSlice } from "@/lib/adminDashboard";
import { DashboardEmpty } from "@/components/admin/DashboardStates";

interface ContentMixChartProps {
  data: ContentMixSlice[];
}

export function ContentMixChart({ data }: ContentMixChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">Content mix</h2>
        <p className="mt-1 text-sm text-ink-gray">Published pages versus drafts across the library.</p>
      </div>

      {total === 0 ? (
        <DashboardEmpty
          title="No pages yet"
          description="Create or publish pages to see the content split."
        />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-48 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="#fcfbf9"
                >
                  {data.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e7dfd1",
                    background: "#fcfbf9",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full space-y-3">
            {data.map((slice) => (
              <li key={slice.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-ink">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.name}
                </span>
                <span className="font-semibold text-ink">
                  {slice.value}
                  <span className="ml-1 text-xs font-normal text-ink-gray">
                    ({Math.round((slice.value / total) * 100)}%)
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
