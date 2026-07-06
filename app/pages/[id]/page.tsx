import { notFound } from "next/navigation";
import Link from "next/link";
import { actionGetPageById, actionGetProfileById, actionGetComments, actionGetProfiles } from "@/app/actions/dbActions";
import CommentSection from "./CommentSection";
import { ArrowLeft, Calendar, Clock, ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostView({ params }: PageProps) {
  const { id } = await params;

  // Fetch page data
  const page = await actionGetPageById(id);
  
  if (!page) {
    notFound();
  }

  // Fetch parallel dependencies: author profile, comments list, and all user profiles for commenter mapping
  const [author, initialComments, profiles] = await Promise.all([
    actionGetProfileById(page.author_id),
    actionGetComments(page.id),
    actionGetProfiles(),
  ]);

  const authorName = author ? author.name : "Unknown Writer";
  const authorAvatar = author ? author.avatar_url : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(page.author_id)}`;

  // Default fallback cover image
  const coverImage = page.cover_image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800";

  // Calculate dynamic reading time (average 200 words per minute)
  const wordCount = page.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back navigation */}
      <Link
        href="/pages"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-ink hover:text-accent-ink-hover mb-8 uppercase tracking-wider transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Library
      </Link>

      {/* Main page sheet */}
      <article className="paper-sheet rounded-xl p-6 sm:p-10 md:p-12 relative shadow-paper">
        {/* Draft Badge warning */}
        {page.status === "draft" && (
          <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-center gap-2 font-semibold">
            <ShieldAlert size={14} className="shrink-0" />
            <span>Draft Preview Mode: This page is currently a draft and is not visible in the public library.</span>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="book-title text-3xl sm:text-5xl font-extrabold text-ink leading-tight mb-6">
            {page.title}
          </h1>

          {/* Author and Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-paper-border/60">
            {/* Author */}
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-10 w-10 rounded-full border border-paper-border bg-paper shadow-sm"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-ink">{authorName}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-ink">Writer</span>
              </div>
            </div>

            {/* Metadata info */}
            <div className="flex items-center gap-4 text-xs text-ink-gray">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-accent-ink/60" />
                {new Date(page.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="h-3 w-[1px] bg-paper-border"></div>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={13} className="text-accent-ink/60" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="w-full h-[240px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-lg border border-paper-border bg-paper shadow-sm mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={page.title}
            className="w-full h-full object-cover opacity-95"
          />
        </div>

        {/* Decorative Divider */}
        <div className="deckle-edge my-8"></div>

        {/* Post Content */}
        <div className="book-body text-base sm:text-lg text-ink leading-relaxed whitespace-pre-wrap break-words">
          {page.content}
        </div>

        {/* Comment Section Client Component */}
        <CommentSection
          pageId={page.id}
          initialComments={initialComments}
          profiles={profiles}
        />
      </article>
    </div>
  );
}
