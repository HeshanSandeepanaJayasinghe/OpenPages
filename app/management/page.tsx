"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { actionDeletePage, actionDeleteProfile, actionGetModerationLogs, actionGetPages, actionGetProfiles } from "@/app/actions/dbActions";
import { AlertTriangle, Shield, Trash2, UserRound, FileText, MessageSquareWarning } from "lucide-react";

interface ManagementRow {
  type: "user" | "post" | "moderation";
  id: string;
  label: string;
  subtitle: string;
  status?: string;
  owner?: string;
}

export default function ManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [moderations, setModerations] = useState<any[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  const handleDeleteUser = async (profileId: string) => {
    if (!confirm("Delete this user and their account data?")) return;
    setBusyId(profileId);
    try {
      const success = await actionDeleteProfile(profileId);
      if (success) {
        setProfiles((current) => current.filter((item) => item.id !== profileId));
        setMessage("User deleted.");
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDeletePost = async (pageId: string) => {
    if (!confirm("Delete this post from the site?")) return;
    setBusyId(pageId);
    try {
      const success = await actionDeletePage(pageId);
      if (success) {
        setPages((current) => current.filter((item) => item.id !== pageId));
        setMessage("Post deleted.");
      }
    } finally {
      setBusyId(null);
    }
  };

  if (!user) {
    return null;
  }

  const rows: ManagementRow[] = [
    ...profiles.map((profile) => ({
      type: "user" as const,
      id: profile.id,
      label: profile.name,
      subtitle: `${profile.email} • ${profile.role}`,
      status: profile.role,
    })),
    ...pages.map((page) => ({
      type: "post" as const,
      id: page.id,
      label: page.title,
      subtitle: `${page.status} • ${new Date(page.created_at).toLocaleDateString()}`,
      owner: profiles.find((profile) => profile.id === page.author_id)?.name || "Unknown author",
    })),
    ...moderations.map((item) => ({
      type: "moderation" as const,
      id: item.id,
      label: item.moderation_result,
      subtitle: `${item.target_type} • ${new Date(item.created_at).toLocaleDateString()}`,
      status: item.target_id,
    })),
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-paper-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">Admin tools</p>
            <h1 className="book-title mt-2 text-3xl font-bold text-ink">Management Hub</h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-gray">
              Review members, moderate published content, and keep the site tidy from a single workspace.
            </p>
          </div>
          <div className="rounded-full border border-accent-ink/15 bg-accent-ink/5 px-4 py-2 text-sm font-semibold text-accent-ink">
            Manage {profiles.length} users • {pages.length} posts • {moderations.length} moderation logs
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-paper-border bg-paper/70 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-accent-ink/10 p-2 text-accent-ink"><UserRound size={18} /></div>
              <div>
                <p className="text-sm font-semibold text-ink">Users</p>
                <p className="text-sm text-ink-gray">Delete accounts that should no longer access the platform.</p>
              </div>
            </div>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between rounded-lg border border-paper-border bg-paper p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{profile.name}</p>
                    <p className="text-xs text-ink-gray">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(profile.id)}
                    disabled={busyId === profile.id}
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-paper-border bg-paper/70 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-accent-ink/10 p-2 text-accent-ink"><FileText size={18} /></div>
              <div>
                <p className="text-sm font-semibold text-ink">Posts</p>
                <p className="text-sm text-ink-gray">Remove posts that violate standards or are no longer appropriate.</p>
              </div>
            </div>
            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="flex flex-col gap-3 rounded-lg border border-paper-border bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{page.title}</p>
                    <p className="text-xs text-ink-gray">{page.status} • by {profiles.find((profile) => profile.id === page.author_id)?.name || "Unknown author"}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePost(page.id)}
                    disabled={busyId === page.id}
                    className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-paper-border bg-paper/70 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-accent-ink/10 p-2 text-accent-ink"><MessageSquareWarning size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-ink">Moderation activity</p>
              <p className="text-sm text-ink-gray">A concise log of recent moderation outcomes.</p>
            </div>
          </div>
          <div className="space-y-3">
            {moderations.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-paper-border bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.moderation_result}</p>
                  <p className="text-xs text-ink-gray">{item.target_type} • {item.target_id}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-gray">
                  <Shield size={14} />
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
