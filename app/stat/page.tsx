"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { actionGetModerationLogs, actionGetPages, actionGetProfiles } from "@/app/actions/dbActions";
import { BarChart3, FileText, Users, ShieldCheck, Sparkles } from "lucide-react";

export default function StatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [moderations, setModerations] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/mypage");
      return;
    }

    const loadData = async () => {
      const [profileData, pageData, moderationData] = await Promise.all([
        actionGetProfiles(),
        actionGetPages(),
        actionGetModerationLogs(),
      ]);
      setProfiles(profileData);
      setPages(pageData);
      setModerations(moderationData);
    };

    if (!loading) {
      loadData();
    }
  }, [loading, user, router]);

  if (!user) {
    return null;
  }

  const writers = profiles.filter((profile) => profile.role === "writer").length;
  const admins = profiles.filter((profile) => profile.role === "admin").length;
  const publishedPosts = pages.filter((page) => page.status === "published").length;
  const draftPosts = pages.filter((page) => page.status === "draft").length;

  const stats = [
    { label: "Writers", value: writers, icon: Users },
    { label: "Admins", value: admins, icon: ShieldCheck },
    { label: "Published posts", value: publishedPosts, icon: FileText },
    { label: "Draft posts", value: draftPosts, icon: Sparkles },
    { label: "Moderation logs", value: moderations.length, icon: BarChart3 },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-8">
        <div className="mb-8 border-b border-paper-border pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">Admin overview</p>
          <h1 className="book-title mt-2 text-3xl font-bold text-ink">Site Statistics</h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-gray">
            A quick pulse on the activity and composition of your OpenPages community.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-paper-border bg-paper/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <div className="rounded-full bg-accent-ink/10 p-2 text-accent-ink">
                    <Icon size={16} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-ink">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
            <h2 className="text-lg font-semibold text-ink">Recent activity snapshot</h2>
            <p className="mt-2 text-sm text-ink-gray">The platform currently hosts {pages.length} pages and {moderations.length} moderation events.</p>
            <div className="mt-5 space-y-3">
              {pages.slice(0, 4).map((page) => (
                <div key={page.id} className="flex items-center justify-between rounded-lg border border-paper-border bg-paper p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{page.title}</p>
                    <p className="text-xs text-ink-gray">{page.status}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-ink">
                    {new Date(page.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-paper-border bg-paper/70 p-6">
            <h2 className="text-lg font-semibold text-ink">Community mix</h2>
            <p className="mt-2 text-sm text-ink-gray">The site currently balances writers and administrators in a simple, readable overview.</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-lg border border-paper-border bg-paper p-4">
                <p className="text-sm font-semibold text-ink">Writers</p>
                <p className="mt-2 text-2xl font-bold text-ink">{writers}</p>
              </div>
              <div className="rounded-lg border border-paper-border bg-paper p-4">
                <p className="text-sm font-semibold text-ink">Admins</p>
                <p className="mt-2 text-2xl font-bold text-ink">{admins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
