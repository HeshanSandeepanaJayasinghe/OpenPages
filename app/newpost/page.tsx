"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  actionCreatePage, 
  actionUpdatePage, 
  actionGetPageById 
} from "@/app/actions/dbActions";
import { 
  ArrowLeft, 
  Feather, 
  Image as ImageIcon, 
  FileText, 
  Globe, 
  Loader2, 
  Check, 
  HelpCircle,
  ShieldAlert
} from "lucide-react";

// Pre-defined Unsplash cover image presets
const PRESET_IMAGES = [
  {
    name: "Classic Books",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
  },
  {
    name: "Diary & Quill",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
  },
  {
    name: "Ancient Library",
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
  },
  {
    name: "Typewriter Desk",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
  },
  {
    name: "Reading Coffee",
    url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800",
  },
  {
    name: "Open Pages",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
  }
];

function NewPostForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Protection & load edit data
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "writer")) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadPageDetails() {
      if (!editId || !user) return;
      setFetchingData(true);
      setError(null);
      try {
        const page = await actionGetPageById(editId);
        if (!page) {
          setError("The requested page does not exist.");
          return;
        }
        if (page.author_id !== user.id) {
          setError("You do not have permission to edit this page.");
          return;
        }
        setTitle(page.title);
        setContent(page.content);
        setCoverImage(page.cover_image);
        setStatus(page.status);
      } catch (err) {
        console.error("Failed to load page details:", err);
        setError("Error loading page details. Please try reloading.");
      } finally {
        setFetchingData(false);
      }
    }

    if (user) {
      loadPageDetails();
    }
  }, [editId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const finalCoverImage = coverImage.trim() || PRESET_IMAGES[0].url;

    try {
      if (editId) {
        // Edit page
        await actionUpdatePage(editId, {
          title: title.trim(),
          content: content.trim(),
          cover_image: finalCoverImage,
          status,
        });
      } else {
        // Create page
        const newPageId = `page-uuid-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
        await actionCreatePage({
          id: newPageId,
          author_id: user!.id,
          title: title.trim(),
          content: content.trim(),
          cover_image: finalCoverImage,
          status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      router.push("/mypage");
    } catch (err: unknown) {
      console.error("Failed to save page:", err);
      setError("An unexpected error occurred while saving your page.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-ink mb-4" size={40} />
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-gray">Loading page details...</p>
      </div>
    );
  }

  if (!user || user.role !== "writer") {
    return null; // redirecting
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <Link
        href="/mypage"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink hover:text-accent-ink-hover mb-8 uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      {/* Main page sheet container */}
      <div className="paper-sheet rounded-xl p-6 sm:p-10 md:p-12 relative shadow-paper">
        <header className="mb-8 border-b border-paper-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-4">
            <Feather size={12} />
            {editId ? "Edit Archive Page" : "Create New Archive Page"}
          </div>
          <h1 className="book-title text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            {editId ? `Edit: ${title || "Untitled"}` : "Draft a New Page"}
          </h1>
          <p className="mt-2 text-sm text-ink-gray book-body leading-relaxed">
            Record your notes, epiphanies, movie analysis, and quotes. Once published, your page will be added to the public library index.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-2">
              Page Title
            </label>
            <input
              id="title"
              type="text"
              required
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Marginalia: A Conversation Across Centuries"
              className="block w-full px-4 py-2.5 rounded-lg border border-paper-border bg-paper text-base text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors disabled:opacity-50 font-semibold"
            />
          </div>

          {/* Cover Image Preset Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-2.5">
              Cover Image Selection
            </label>
            
            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {PRESET_IMAGES.map((preset, idx) => {
                const isSelected = coverImage === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden border bg-paper-dark transition-all ${
                      isSelected
                        ? "ring-2 ring-accent-ink border-transparent scale-102 shadow-md"
                        : "border-paper-border hover:border-accent-ink/65 hover:scale-101"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    {isSelected && (
                      <span className="absolute inset-0 bg-accent-ink/20 flex items-center justify-center text-paper">
                        <Check size={18} className="stroke-[3]" />
                      </span>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white py-0.5 text-center truncate font-medium">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                <ImageIcon size={16} />
              </span>
              <input
                type="url"
                disabled={loading}
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Or paste custom image URL (Unsplash, imgur, etc.). Leave blank for default."
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors disabled:opacity-50"
              />
            </div>
            
            {/* Visual Cover Preview if present */}
            {coverImage && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-paper-border aspect-[21/9] max-h-36 bg-paper-dark/20 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Visual Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                  }}
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[9px] text-paper font-semibold uppercase tracking-wider shadow-sm">
                  Visual Cover Preview
                </span>
              </div>
            )}
          </div>

          {/* Content TextArea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-xs font-bold uppercase tracking-wider text-ink-gray">
                Page Content
              </label>
              <span className="text-[10px] text-ink-gray/60 font-medium">
                Uses elegant typography formatting
              </span>
            </div>
            <textarea
              id="content"
              rows={12}
              required
              disabled={loading}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts, quotes, critique... Slow down and let the words flow naturally onto the page."
              className="block w-full px-5 py-4 rounded-lg border border-paper-border bg-paper text-base text-ink placeholder-ink-gray/40 focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors disabled:opacity-50 book-body leading-relaxed whitespace-pre-wrap"
            ></textarea>
          </div>

          {/* Status & Options Panel */}
          <div className="p-5 rounded-lg border border-paper-border bg-paper-dark/25 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
                Visibility Options
              </h3>
              <p className="text-[11px] text-ink-gray book-body leading-tight">
                Published pages are publicly browseable in the library. Draft pages are only visible to you on your writer dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setStatus("draft")}
                className={`flex-1 md:flex-initial py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                  status === "draft"
                    ? "bg-amber-50 border-amber-300 text-amber-800 shadow-sm"
                    : "border-paper-border bg-paper hover:bg-black/5 text-ink-gray"
                }`}
              >
                <FileText size={13} />
                Save Draft
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => setStatus("published")}
                className={`flex-1 md:flex-initial py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-all ${
                  status === "published"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                    : "border-paper-border bg-paper hover:bg-black/5 text-ink-gray"
                }`}
              >
                <Globe size={13} />
                Publish Publicly
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-paper-border flex items-center justify-end gap-3">
            <Link
              href="/mypage"
              className="px-5 py-2.5 rounded-lg border border-paper-border hover:bg-black/5 text-sm font-semibold transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-accent-ink-hover shadow-paper disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Page...
                </>
              ) : editId ? (
                "Save Changes"
              ) : (
                status === "published" ? "Publish Page" : "Save Draft Page"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewPost() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-ink mb-4" size={40} />
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-gray">Loading page context...</p>
      </div>
    }>
      <NewPostForm />
    </Suspense>
  );
}
