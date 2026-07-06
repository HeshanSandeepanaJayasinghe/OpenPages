"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { actionCreateComment } from "@/app/actions/dbActions";
import { Comment, Profile } from "@/lib/db";
import { MessageSquare, Send, Lock, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";

interface CommentSectionProps {
  pageId: string;
  initialComments: Comment[];
  profiles: Profile[];
}

export default function CommentSection({ pageId, initialComments, profiles }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Map profiles for quick author lookup
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const tempCommentId = `comment-uuid-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // 1. Moderate content via OpenAI API endpoint
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          type: "comment",
          targetId: tempCommentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to moderate comment. Please try again.");
      }

      const modResult = await response.json();

      // 2. If content is flagged, block comment creation and show details
      if (modResult.flagged) {
        const flaggedCats = Object.entries(modResult.categories)
          .filter(([, val]) => val)
          .map(([name]) => name)
          .join(", ");
        setError(`Your comment violates our community standards: [Flagged: ${flaggedCats || modResult.result}]`);
        setIsSubmitting(false);
        return;
      }

      // 3. Create clean comment in the database
      const newComment: Comment = {
        id: tempCommentId,
        page_id: pageId,
        user_id: user.id,
        content: commentText.trim(),
        created_at: new Date().toISOString(),
      };

      await actionCreateComment(newComment);

      // 4. Update UI and reset state
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      console.error("Failed to post comment:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred while posting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-paper-border">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare size={20} className="text-accent-ink" />
        <h2 className="book-title text-2xl font-bold text-ink">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Write Comment Section */}
      <div className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
                Leave a Comment as <span className="text-accent-ink">{user.name}</span>
              </label>
              <textarea
                id="comment"
                rows={4}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                placeholder="Share your contemplation, critique, or insights..."
                className="block w-full px-4 py-3 rounded-lg border border-paper-border bg-paper text-sm text-ink placeholder-ink-gray/60 focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors disabled:opacity-50 font-sans"
              ></textarea>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <ShieldAlert size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
                <CheckCircle size={15} className="mt-0.5 shrink-0" />
                <span>Comment posted successfully after automated AI moderation check.</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-ink-gray/80 font-medium">
                🛡️ AI-based Content Moderation active for community protection
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-accent-ink-hover disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Checking Content...
                  </>
                ) : (
                  <>
                    Post Comment
                    <Send size={12} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-xl border border-paper-border bg-paper-dark/20 text-center flex flex-col items-center justify-center">
            <Lock size={20} className="text-ink-gray/50 mb-2" />
            <h3 className="text-sm font-semibold text-ink">Join the Discussion</h3>
            <p className="text-xs text-ink-gray book-body max-w-sm mt-1 mb-4">
              Please sign in with your library account to participate in the conversation and write comments.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-accent-ink-hover shadow-sm transition-colors"
            >
              Sign In to Comment
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm italic text-ink-gray/70 book-body text-center py-6">
            No comments posted yet.
          </p>
        ) : (
          comments.map((comment) => {
            const commenter = profileMap.get(comment.user_id);
            const commenterName = commenter ? commenter.name : "Unknown Contributor";
            const commenterAvatar = commenter ? commenter.avatar_url : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(comment.user_id)}`;
            const commenterRole = commenter ? commenter.role : "user";

            return (
              <article
                key={comment.id}
                className="flex gap-4 p-4 rounded-xl border border-paper-border/50 bg-paper/40"
              >
                {/* Avatar */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={commenterAvatar}
                  alt={commenterName}
                  className="h-9 w-9 rounded-full border border-paper-border bg-paper shadow-sm shrink-0"
                />

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink">
                        {commenterName}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-ink/5 border border-accent-ink/10 text-accent-ink font-bold uppercase tracking-wider scale-90">
                        {commenterRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-gray">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-ink-gray leading-relaxed font-sans whitespace-pre-line break-words">
                    {comment.content}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
