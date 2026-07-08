"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User as UserIcon, 
  FileText, 
  Key, 
  Mail, 
  LogOut, 
  Trash2, 
  ShieldAlert, 
  Loader2, 
  CheckCircle,
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function MyProfile() {
  const { user, loading: authLoading, updateUser, logout, deleteAccount } = useAuth();
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Protected route check & init form
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        setName(user.name || "");
        setBio(user.bio || "");
        setAvatarUrl(user.avatar_url || "");
      }
    }
  }, [user, authLoading, router]);

  // Generate random avatar seed
  const handleRandomizeAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updates: any = {
        name: name.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl.trim(),
      };

      if (password) {
        updates.password = password;
      }

      await updateUser(updates);
      setSuccess("Profile credentials updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to log out.");
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("Please type DELETE to confirm account deletion.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await deleteAccount();
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete account.");
      setLoading(false);
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-ink mb-4" size={40} />
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-gray">Loading profile details...</p>
      </div>
    );
  }

  if (!user) {
    return null; // redirecting
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href={user.role === "admin" ? "/stat" : "/mypage"}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink hover:text-accent-ink-hover mb-8 uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <div className="space-y-8">
        {/* Main Settings Page */}
        <div className="paper-sheet rounded-xl p-6 sm:p-10 md:p-12 relative shadow-paper">
          <header className="mb-8 border-b border-paper-border pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-4">
              <UserIcon size={12} />
              Account Settings
            </div>
            <h1 className="book-title text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-ink-gray book-body leading-relaxed">
              Edit your name, public bio, and avatar. Update your security password, or manage account termination.
            </p>
          </header>

          {/* Success Notification */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2.5">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-lg border border-paper-border bg-paper-dark/10">
              <div className="relative h-20 w-20 shrink-0 rounded-full border border-paper-border bg-paper overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`} 
                  alt={name} 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Avatar Image</h3>
                <p className="text-[11px] text-ink-gray book-body">
                  Set a custom URL or click below to automatically randomize a fun character profile image.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRandomizeAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-accent-ink/20 hover:border-accent-ink bg-paper text-xs font-semibold text-accent-ink hover:bg-accent-ink/5 transition-all shadow-sm"
                  >
                    <Sparkles size={12} />
                    Randomize Avatar
                  </button>
                  <input
                    type="url"
                    disabled={loading}
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Custom image URL"
                    className="block w-full max-w-xs px-2.5 py-1.5 rounded border border-paper-border bg-paper text-xs focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                    <UserIcon size={16} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                    placeholder="Clara Inkwell"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                  Email Address (Read Only)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/45">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper-dark/20 text-sm text-ink-gray/70 select-none outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Bio field */}
            <div>
              <label htmlFor="bio" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                Writer Biography
              </label>
              <div className="relative">
                <span className="absolute top-3 left-3.5 text-ink-gray/60">
                  <FileText size={16} />
                </span>
                <textarea
                  id="bio"
                  rows={4}
                  disabled={loading}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your readers a bit about your writing journey, thoughts, and preferred subjects..."
                  className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors book-body leading-relaxed"
                ></textarea>
              </div>
            </div>

            {/* Security fields */}
            <div className="border-t border-paper-border/60 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
                Update Security Password
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pass" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                      <Key size={16} />
                    </span>
                    <input
                      id="pass"
                      type="password"
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep same"
                      className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="conf" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                      <Key size={16} />
                    </span>
                    <input
                      id="conf"
                      type="password"
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Leave blank to keep same"
                      className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="pt-6 border-t border-paper-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleLogout}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-paper-border hover:bg-accent-ink/5 hover:border-accent-ink hover:text-accent-ink text-sm font-semibold transition-all"
              >
                <LogOut size={16} />
                Log Out
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-accent-ink-hover shadow-paper disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="paper-sheet border-red-200 rounded-xl p-6 sm:p-10 md:p-12 relative shadow-paper">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-red-600 rounded-t-xl opacity-80"></div>
          
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-600 shadow-sm mb-4 shrink-0">
              <ShieldAlert size={20} />
            </span>
            
            <div className="space-y-4 flex-1">
              <h2 className="book-title text-xl font-bold text-red-800">
                Danger Zone: Account Deletion
              </h2>
              
              <p className="text-xs text-ink-gray book-body leading-relaxed max-w-2xl">
                Deleting your account is permanent. It will permanently delete your user profile information, public biography, credentials, and all draft/published archive pages you have authored (along with comments).
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-all shadow-sm"
                >
                  <Trash2 size={13} />
                  Delete My Account
                </button>
              ) : (
                <div className="p-4 rounded-lg bg-red-50/50 border border-red-200 space-y-3.5 max-w-md">
                  <p className="text-xs font-bold text-red-800">
                    To confirm deletion, please type "DELETE" below:
                  </p>
                  
                  <input
                    type="text"
                    disabled={loading}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="block w-full px-3 py-2 rounded border border-red-300 bg-paper text-sm text-red-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none uppercase font-bold"
                    placeholder="DELETE"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText("");
                      }}
                      className="px-3 py-1.5 rounded border border-paper-border bg-paper hover:bg-black/5 text-xs font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      disabled={loading || deleteConfirmText !== "DELETE"}
                      onClick={handleDeleteAccount}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-xs font-semibold text-paper shadow-sm transition-all"
                    >
                      {loading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Confirm Terminate Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
