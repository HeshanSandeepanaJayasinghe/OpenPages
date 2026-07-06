import Link from "next/link";
import { actionGetPages, actionGetProfiles } from "@/app/actions/dbActions";
import { ArrowRight, Feather, Calendar, BookOpen } from "lucide-react";

export default async function Pages() {
  const [allPages, allProfiles] = await Promise.all([
    actionGetPages(),
    actionGetProfiles(),
  ]);

  // Filter to show only published pages
  const publishedPages = allPages.filter((p) => p.status === "published");

  // Create a profile lookup map
  const profileMap = new Map(allProfiles.map((p) => [p.id, p]));

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header section */}
      <header className="mb-12 border-b border-paper-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen size={12} />
          The Public Library
        </div>
        <h1 className="book-title text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
          Browse All Pages
        </h1>
        <p className="mt-3 text-lg text-ink-gray max-w-2xl book-body">
          Explore a collection of reviews, epiphanies, quotes, and thoughts published by our community of writers.
        </p>
      </header>

      {publishedPages.length === 0 ? (
        <div className="text-center py-20 paper-sheet rounded-xl">
          <Feather className="mx-auto text-ink-gray/40 mb-4" size={48} />
          <h2 className="book-title text-2xl font-bold text-ink">No Pages Published Yet</h2>
          <p className="mt-2 text-ink-gray book-body max-w-md mx-auto">
            Our writers are busy drafting their thoughts. Check back soon for new insights, book reviews, and creative writing.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent-ink-hover shadow-paper transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPages.map((page) => {
            const author = profileMap.get(page.author_id);
            const authorName = author ? author.name : "Unknown Writer";
            const authorAvatar = author ? author.avatar_url : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(page.author_id)}`;
            
            // Fallback cover image if none is provided
            const coverImage = page.cover_image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800";

            return (
              <article
                key={page.id}
                className="paper-card rounded-lg overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-paper-lg transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="h-48 overflow-hidden relative border-b border-paper-border bg-paper-dark/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={page.title}
                    className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-paper/95 text-[10px] uppercase font-bold tracking-wider text-accent-ink border border-paper-border shadow-sm">
                    Article
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author section */}
                    <div className="flex items-center gap-2.5 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={authorAvatar}
                        alt={authorName}
                        className="h-7 w-7 rounded-full border border-paper-border bg-paper shadow-sm"
                      />
                      <span className="text-xs font-semibold text-ink-gray hover:text-accent-ink transition-colors">
                        {authorName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="book-title text-xl font-bold text-ink mb-3 line-clamp-2 group-hover:text-accent-ink">
                      <Link href={`/pages/${page.id}`}>
                        {page.title}
                      </Link>
                    </h3>

                    {/* Snippet */}
                    <p className="text-sm text-ink-gray book-body line-clamp-3 mb-4">
                      {page.content}
                    </p>
                  </div>

                  {/* Footer Area */}
                  <div className="pt-4 border-t border-paper-border/60 flex items-center justify-between mt-auto">
                    <span className="text-[11px] text-ink-gray flex items-center gap-1.5 font-medium">
                      <Calendar size={12} className="text-accent-ink/60" />
                      {new Date(page.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/pages/${page.id}`}
                      className="text-xs font-semibold text-accent-ink hover:text-accent-ink-hover flex items-center gap-1 group/btn"
                    >
                      Read Page 
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
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