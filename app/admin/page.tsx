"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  actionGetComments,
  actionGetModerationLogs,
  actionGetPages,
  actionGetProfiles,
} from "@/app/actions/dbActions";
import {
  buildAdminDashboardSummary,
  type AdminDashboardSummary,
} from "@/lib/adminDashboard";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { ContentMixChart } from "@/components/admin/ContentMixChart";
import { DashboardError, DashboardLoading } from "@/components/admin/DashboardStates";
import { ModerationPulse } from "@/components/admin/ModerationPulse";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentPagesTable } from "@/components/admin/RecentPagesTable";
import { StatCard } from "@/components/admin/StatCard";
import { TopWriters } from "@/components/admin/TopWriters";

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isLive } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setDataLoading(true);
    setError(null);

    try {
      const [profiles, pages, comments, logs] = await Promise.all([
        actionGetProfiles(),
        actionGetPages(),
        actionGetComments(),
        actionGetModerationLogs(),
      ]);
      setSummary(buildAdminDashboardSummary(profiles, pages, comments, logs));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while loading admin data.";
      setError(message);
      setSummary(null);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/mypage");
      return;
    }

    void loadDashboard();
  }, [authLoading, user, router, loadDashboard]);

  if (authLoading || (dataLoading && !summary && !error)) {
    return <DashboardLoading />;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  if (error && !summary) {
    return <DashboardError message={error} onRetry={() => void loadDashboard()} />;
  }

  if (!summary) {
    return <DashboardLoading />;
  }

  const { kpis } = summary;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-6 sm:p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-paper-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">Admin dashboard</p>
            <h1 className="book-title mt-2 text-3xl font-bold text-ink">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-gray">
              A high-level overview of community activity, publishing health, and moderation — with quick paths into
              management tools.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                isLive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {isLive ? "Live data" : "Demo data"}
            </span>
            {error ? (
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                Partial refresh failed
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Writers" value={kpis.writers} hint="Active contributors" icon={Users} />
          <StatCard label="Admins" value={kpis.admins} hint="Platform managers" icon={ShieldCheck} />
          <StatCard label="Published" value={kpis.published} hint="Live pages" icon={FileText} tone="success" />
          <StatCard label="Drafts" value={kpis.drafts} hint="In progress" icon={Sparkles} tone="warning" />
          <StatCard label="Comments" value={kpis.comments} hint="Reader engagement" icon={MessageSquare} />
          <StatCard
            label="Moderation"
            value={kpis.moderationEvents}
            hint={`${kpis.flaggedEvents} flagged`}
            icon={ShieldAlert}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <ActivityChart data={summary.activity} />
          <ContentMixChart data={summary.contentMix} />
        </div>

        <div className="mt-6">
          <QuickActions onRefresh={() => void loadDashboard(true)} refreshing={refreshing} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <RecentPagesTable rows={summary.recentPages} />
          <div className="flex flex-col gap-6">
            <ModerationPulse
              items={summary.moderationPulse}
              flaggedCount={kpis.flaggedEvents}
              totalCount={kpis.moderationEvents}
            />
            <TopWriters writers={summary.topWriters} roleMix={summary.roleMix} />
          </div>
        </div>
      </div>
    </div>
  );
}
