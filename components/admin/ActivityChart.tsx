"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ActivityPoint } from "@/lib/adminDashboard";
import { DashboardEmpty } from "@/components/admin/DashboardStates";

interface ActivityChartProps {
  data: ActivityPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const hasSignal = data.some((point) => point.posts + point.comments + point.moderation > 0);

  return (
    <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">Publishing activity</h2>
        <p className="mt-1 text-sm text-ink-gray">Posts, comments & moderation events over recent months.</p>
      </div>

      {!hasSignal ? (
        <DashboardEmpty
          title="No activity yet"
          description="Once writers publish pages and readers comment, trends will appear here."
        />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="postsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b2626" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b2626" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e7dfd1" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#5c5850", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#5c5850", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e7dfd1",
                  background: "#fcfbf9",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#5c5850" }} />
              <Area
                type="monotone"
                dataKey="posts"
                name="Posts"
                stroke="#8b2626"
                fill="url(#postsFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="comments"
                name="Comments"
                stroke="#1c3d5a"
                fill="transparent"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="moderation"
                name="Moderation"
                stroke="#c4a574"
                fill="transparent"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
