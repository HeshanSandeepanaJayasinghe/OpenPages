import Link from "next/link";
import { actionGetPages } from "@/app/actions/dbActions";
import { Book, Feather, ArrowRight, MessageSquare, Quote, Eye } from "lucide-react";

export default async function Home() {
  const allPages = await actionGetPages();
  const publishedPages = allPages.filter(p => p.status === "published").slice(0, 3);

  const categories = [
    { name: "Book Reviews", desc: "Share critiques, summaries, and rating of your latest reads." },
    { name: "Favorite Book Quotes", desc: "Post the quotes that inspired, shook, or changed you." },
    { name: "Movie Thoughts", desc: "Write cinema analyses, direct opinions, or deep-dives." },
    { name: "Shower Thoughts", desc: "Share those epiphanies that come out of nowhere." },
    { name: "Creative Writing", desc: "Unleash short stories, prose pieces, and fiction snippets." },
    { name: "Life Lessons", desc: "Reflect on milestones, personal discoveries, and wisdom." },
    { name: "Interesting Ideas", desc: "Log novelty thoughts, philosophical questions, and theories." },
    { name: "Mini Essays", desc: "Draft concise arguments about culture, tech, and art." },
    { name: "Poems & Snippets", desc: "Post raw feelings, prose, poetry, and emotional logs." }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-16 pb-20 px-4 md:px-8 border-b border-paper-border bg-gradient-to-b from-paper/40 to-transparent">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-ink/20 bg-accent-ink/5 text-accent-ink text-xs font-semibold uppercase tracking-wider mb-6">
            <Feather size={12} />
            A Space for Creativity & Novelty
          </div>
          
          <h1 className="book-title text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-tight sm:leading-none mb-6">
            Publish your passion.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-ink-gray book-body mb-8">
            Did you read a book? Post the best quote. Have a fleeting thought? Capture it. 
            Go crazy with imagination. Write a book review? Go on.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-accent-ink text-paper hover:bg-accent-ink-hover font-medium shadow-paper flex items-center justify-center gap-2 group transition-all"
            >
              Get Started Writing
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link 
              href="/pages" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-paper-border bg-paper text-ink hover:bg-black/5 font-medium shadow-sm transition-colors"
            >
              Browse the Library
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Book Page Stack Effect */}
      <div className="w-full h-1 bg-paper-border/30 relative">
        <div className="absolute inset-x-0 -top-1 height-[2px] bg-paper-border/10"></div>
      </div>

      {/* Possibilities Section */}
      <section className="w-full py-20 px-4 md:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="book-title text-3xl font-bold text-ink mb-3">Anything is Possible</h2>
          <p className="text-ink-gray max-w-lg mx-auto">
            OpenPages is a clean slate. We welcome all forms of written expression—tactile, clean, and thoughtful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="paper-card p-6 rounded-xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-paper-lg transition-all"
            >
              <div>
                <div className="h-1.5 w-12 bg-accent-ink/10 rounded mb-4"></div>
                <h3 className="font-semibold text-lg text-ink mb-2">{cat.name}</h3>
                <p className="text-sm text-ink-gray leading-relaxed book-body">{cat.desc}</p>
              </div>
              <div className="mt-4 flex items-center text-xs text-accent-ink font-semibold group cursor-pointer">
                <span>Explore</span>
                <ArrowRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Works Section */}
      <section className="w-full py-20 px-4 md:px-8 border-t border-paper-border bg-paper-dark/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <h2 className="book-title text-3xl font-bold text-ink mb-3">From the Archives</h2>
              <p className="text-ink-gray">A curated look into active pages posted by our writers.</p>
            </div>
            <Link 
              href="/pages" 
              className="mt-4 sm:mt-0 text-sm font-semibold text-accent-ink hover:text-accent-ink-hover flex items-center gap-1.5 border-b border-accent-ink/20 pb-0.5"
            >
              View all pages
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedPages.map((page) => (
              <article key={page.id} className="paper-card rounded-lg overflow-hidden flex flex-col h-full">
                {page.cover_image && (
                  <div className="h-48 overflow-hidden relative border-b border-paper-border bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={page.cover_image} 
                      alt={page.title} 
                      className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-paper/95 text-[10px] uppercase font-bold tracking-wider text-accent-ink border border-paper-border">
                      Page
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="book-title text-xl font-bold text-ink mb-3 line-clamp-2">
                      {page.title}
                    </h3>
                    <p className="text-sm text-ink-gray book-body line-clamp-3 mb-4">
                      {page.content}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-paper-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-ink-gray">
                      {new Date(page.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Link 
                      href={`/pages/${page.id}`} 
                      className="text-xs font-semibold text-accent-ink hover:text-accent-ink-hover flex items-center gap-1"
                    >
                      Read Page <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="w-full py-20 px-4 md:px-8 border-t border-paper-border bg-paper">
        <div className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto text-accent-ink/20 mb-6" size={40} />
          <p className="book-title text-2xl md:text-3xl italic text-ink leading-relaxed mb-6">
            &ldquo;A room without books is like a body without a soul.&rdquo;
          </p>
          <div className="h-[1px] w-12 bg-accent-ink/40 mx-auto mb-4"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-gray">Marcus Tullius Cicero</span>
        </div>
      </section>
    </div>
  );
}
