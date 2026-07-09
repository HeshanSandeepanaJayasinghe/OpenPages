"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Lock, UserCircle2, Save, ShieldAlert } from "lucide-react";

export default function MyProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/mypage");
    }
    if (!loading && user) {
      setName(user.name);
    }
  }, [loading, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!name.trim()) {
      setError("Please enter a display name.");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("The new password confirmation does not match.");
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        password: password || undefined,
      } as Parameters<typeof updateUser>[0]);
      setFeedback("Your admin profile has been updated.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update your profile right now.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="paper-sheet rounded-2xl p-8">
        <div className="mb-8 flex flex-col gap-4 border-b border-paper-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">Admin profile</p>
            <h1 className="book-title mt-2 text-3xl font-bold text-ink">My Profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-gray">
              Keep your public identity up to date and refresh your password from one secure place.
            </p>
          </div>
          <div className="rounded-full border border-accent-ink/15 bg-accent-ink/5 px-4 py-2 text-sm font-semibold text-accent-ink">
            Signed in as {user.email}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {feedback && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-2xl border border-paper-border bg-paper/70 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent-ink/10 p-3 text-accent-ink">
                <UserCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Personal details</p>
                <p className="text-sm text-ink-gray">Your name appears across the admin workspace and public pages.</p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-gray" htmlFor="name">
                Display name
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-paper-border bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent-ink focus:ring-1 focus:ring-accent-ink"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-gray" htmlFor="password">
                New password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-gray/60">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-paper-border bg-paper py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-accent-ink focus:ring-1 focus:ring-accent-ink"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-gray" htmlFor="confirmPassword">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-paper-border bg-paper px-4 py-2.5 text-sm text-ink outline-none transition focus:border-accent-ink focus:ring-1 focus:ring-accent-ink"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-paper-border bg-paper-dark/20 p-6">
            <div>
              <p className="text-sm font-semibold text-ink">Security note</p>
              <p className="mt-2 text-sm text-ink-gray">
                Use a strong password to keep your administrative account safe. Leaving the password field empty preserves the current one.
              </p>
            </div>

            <div className="rounded-xl border border-paper-border bg-paper p-4 text-sm text-ink-gray">
              <p className="font-semibold text-ink">Current account</p>
              <p className="mt-2">Name: {user.name}</p>
              <p className="mt-1">Role: {user.role}</p>
            </div>

            <button
              type="submit"
              disabled={isSaving || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-accent-ink-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving changes..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
