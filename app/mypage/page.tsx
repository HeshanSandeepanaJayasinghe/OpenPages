"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  actionGetPages, 
  actionDeletePage, 
  actionUpdatePage 
} from "@/app/actions/dbActions";
import { Page } from "@/lib/db";
import { 
  Feather, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Globe, 
  FileText, 
  Loader2, 
  ShieldAlert, 
  Calendar,
  RefreshCw
} from "lucide-react";

export default function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null); // tracks delete/publish loader for specific pages
  const [error, setError] = useState<string | null>(null);

  // Protected route check
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "writer")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load writer's pages
  const fetchMyPages = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const allPages = await actionGetPages();
      // Filter for current user's own pages
      const myPages = allPages.filter((p) => p.author_id === user.id);
      setPages(myPages);
    } catch (err: unknown) {
      setError("Failed to load your pages. Please reload.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "writer") {
      fetchMyPages();
    }
  }, [user]);

  // Toggle page publish status (draft <-> published)
  const handleToggleStatus = async (page: Page) => {
    setActionId(page.id);
    const newStatus = page.status === "published" ? "draft" : "published";
    try {
      await actionUpdatePage(page.id, { status: newStatus });
      // Update local state
      setPages((prev) =>
        prev.map((p) => (p.id === page.id ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Could not update the page status.");
    } finally {
      setActionId(null);
    }
  };

  // Delete page
  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page? This action cannot be undone.")) {
      return;
    }
    setActionId(id);
    try {
      await actionDeletePage(id);
      // Remove from local state
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete page:", err);
      alert("Failed to delete page.");
    } finally {
      setActionId(null);
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-ink mb-4" size={40} />
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-gray">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== "writer") {
    return null; // redirecting
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <header className="mb-10 border-b border-paper-border pb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-4">
            <Feather size={12} />
            Writer Dashboard
          </div>
          <h1 className="book-title text-4xl font-extrabold text-ink leading-none">
            My Pages
          </h1>
          <p className="mt-3 text-sm text-ink-gray max-w-xl book-body">
            Manage your draft and published creations. Craft reviews, organize novel ideas, and capture marginalia.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchMyPages}
            disabled={loading}
            className="flex items-center justify-center h-11 w-11 rounded-lg border border-paper-border bg-paper text-ink-gray hover:text-accent-ink hover:bg-black/5 disabled:opacity-50 transition-all"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/newpost"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-accent-ink-hover shadow-paper hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} />
            Write a New Page
          </Link>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pages List */}
      {loading && pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-accent-ink mb-3" size={32} />
          <p className="text-xs font-bold uppercase tracking-wider text-ink-gray">Fetching your archive...</p>
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 paper-sheet rounded-xl border-dashed">
          <FileText className="mx-auto text-ink-gray/40 mb-4" size={48} />
          <h2 className="book-title text-2xl font-bold text-ink">Your Library is Empty</h2>
          <p className="mt-2 text-ink-gray book-body max-w-md mx-auto">
            You haven't written any pages yet. Click the button above to draft your very first book review, lesson, or quote!
          </p>
          <div className="mt-6">
            <Link
              href="/newpost"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-accent-ink-hover shadow-paper transition-colors"
            >
              <Plus size={16} />
              Write First Page
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pages.map((page) => {
            const coverImage = page.cover_image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800";
            const isWorking = actionId === page.id;

            return (
              <article
                key={page.id}
                className="paper-card rounded-lg overflow-hidden flex flex-col h-full hover:shadow-paper-lg transition-all relative border border-paper-border bg-paper"
              >
                {/* Cover Image and Badge */}
                <div className="h-40 overflow-hidden relative border-b border-paper-border bg-paper-dark/20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={page.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border shadow-sm ${
                    page.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {page.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-ink-gray mb-2.5 font-medium">
                      <Calendar size={12} className="text-accent-ink/60" />
                      <span>
                        Created:{" "}
                        {new Date(page.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="book-title text-xl font-bold text-ink mb-2 line-clamp-2">
                      {page.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs text-ink-gray book-body line-clamp-3 mb-6">
                      {page.content}
                    </p>
                  </div>

                  {/* Actions Dashboard */}
                  <div className="pt-4 border-t border-paper-border/60 flex items-center justify-between mt-auto">
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleStatus(page)}
                      disabled={isWorking}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider border transition-all ${
                        page.status === "published"
                          ? "bg-amber-50/50 hover:bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 border-emerald-200"
                      } disabled:opacity-50`}
                      title={page.status === "published" ? "Change to Draft" : "Publish Publicly"}
                    >
                      {isWorking ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : page.status === "published" ? (
                        <>
                          <FileText size={12} />
                          Revert to Draft
                        </>
                      ) : (
                        <>
                          <Globe size={12} />
                          Go Live
                        </>
                      )}
                    </button>

                    {/* CRUD Options */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/pages/${page.id}`}
                        className="p-1.5 rounded-lg border border-paper-border text-ink-gray hover:text-accent-ink hover:bg-accent-ink/5 transition-colors"
                        title="Preview Public Page"
                      >
                        <Eye size={14} />
                      </Link>

                      <Link
                        href={`/newpost?id=${page.id}`}
                        className="p-1.5 rounded-lg border border-paper-border text-ink-gray hover:text-accent-ink hover:bg-accent-ink/5 transition-colors"
                        title="Edit Page"
                      >
                        <Edit size={14} />
                      </Link>

                      <button
                        onClick={() => handleDeletePage(page.id)}
                        disabled={isWorking}
                        className="p-1.5 rounded-lg border border-paper-border text-ink-gray hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Page"
                      >
                        {isWorking ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
