"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { BookOpen, User, LogOut, Shield, Feather, Settings, HelpCircle, Database, DatabaseZap } from "lucide-react";

export function Header() {
  const { user, logout, isLive } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-border bg-paper/95 backdrop-blur-md">
      {/* Database Mode Ribbon */}
      <div className={`text-center py-1 text-xs font-semibold px-4 flex items-center justify-center gap-1.5 transition-colors ${
        isLive 
          ? "bg-emerald-50 text-emerald-700 border-b border-emerald-100" 
          : "bg-amber-50 text-amber-700 border-b border-amber-100"
      }`}>
        {isLive ? (
          <>
            <DatabaseZap size={13} className="text-emerald-600 animate-pulse" />
            <span>Live Mode: Connected to Supabase Database</span>
          </>
        ) : (
          <>
            <Database size={13} className="text-amber-600" />
            <span>Demonstration Mode: Local File & Storage Mock Database (Persistent)</span>
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-ink text-paper shadow-paper group-hover:scale-105 transition-transform">
                <BookOpen size={20} />
              </span>
              <span className="book-title text-xl tracking-tight text-ink">
                OpenPages
              </span>
            </Link>

            {/* Standard Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link 
                href="/" 
                className={`transition-colors py-1.5 border-b-2 ${
                  isActive("/") 
                    ? "border-accent-ink text-accent-ink font-semibold" 
                    : "border-transparent text-ink-gray hover:text-ink hover:border-paper-border"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/pages" 
                className={`transition-colors py-1.5 border-b-2 ${
                  isActive("/pages") || pathname?.startsWith("/pages/")
                    ? "border-accent-ink text-accent-ink font-semibold" 
                    : "border-transparent text-ink-gray hover:text-ink hover:border-paper-border"
                }`}
              >
                Pages
              </Link>
              <Link 
                href="/aboutus" 
                className={`transition-colors py-1.5 border-b-2 ${
                  isActive("/aboutus") 
                    ? "border-accent-ink text-accent-ink font-semibold" 
                    : "border-transparent text-ink-gray hover:text-ink hover:border-paper-border"
                }`}
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* User Section / CTA */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 md:gap-5">
                {/* Role Specific Nav Items */}
                <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                  {user.role === "writer" && (
                    <>
                      <Link 
                        href="/myprofile" 
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded border ${
                          isActive("/myprofile") 
                            ? "bg-accent-ink/5 border-accent-ink/20 text-accent-ink" 
                            : "border-transparent text-ink-gray hover:text-ink hover:bg-black/5"
                        }`}
                      >
                        <User size={13} />
                        Profile
                      </Link>
                      <Link 
                        href="/mypage" 
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded border ${
                          isActive("/mypage") 
                            ? "bg-accent-ink/5 border-accent-ink/20 text-accent-ink" 
                            : "border-transparent text-ink-gray hover:text-ink hover:bg-black/5"
                        }`}
                      >
                        <Feather size={13} />
                        My Pages
                      </Link>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <Link 
                        href="/stat" 
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded border ${
                          isActive("/stat") 
                            ? "bg-accent-ink/5 border-accent-ink/20 text-accent-ink" 
                            : "border-transparent text-ink-gray hover:text-ink hover:bg-black/5"
                        }`}
                      >
                        <Shield size={13} />
                        Stats
                      </Link>
                      <Link 
                        href="/management" 
                        className={`flex items-center gap-1.5 py-1 px-2.5 rounded border ${
                          isActive("/management") 
                            ? "bg-accent-ink/5 border-accent-ink/20 text-accent-ink" 
                            : "border-transparent text-ink-gray hover:text-ink hover:bg-black/5"
                        }`}
                      >
                        <Settings size={13} />
                        Management
                      </Link>
                    </>
                  )}
                </nav>

                <div className="h-6 w-[1px] bg-paper-border hidden sm:block"></div>

                {/* User Dropdown/Card */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={user.avatar_url} 
                      alt={user.name} 
                      className="h-9 w-9 rounded-full border border-paper-border bg-paper shadow-sm"
                    />
                    <div className="hidden lg:flex flex-col text-left leading-tight">
                      <span className="text-sm font-medium text-ink truncate max-w-[120px]">{user.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-ink">{user.role}</span>
                    </div>
                  </div>

                  <button 
                    onClick={logout} 
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-paper-border text-ink-gray hover:text-accent-ink hover:bg-accent-ink/5 transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-ink-gray hover:text-ink px-3 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  href="/login" 
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-accent-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent-ink-hover shadow-paper transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation for Logged In User Specifics */}
        {user && (
          <div className="sm:hidden flex items-center justify-center gap-4 py-2 border-t border-paper-border text-[11px] font-semibold uppercase tracking-wider">
            {user.role === "writer" && (
              <>
                <Link href="/myprofile" className={`flex items-center gap-1 ${isActive("/myprofile") ? "text-accent-ink" : "text-ink-gray"}`}>
                  Profile
                </Link>
                <Link href="/mypage" className={`flex items-center gap-1 ${isActive("/mypage") ? "text-accent-ink" : "text-ink-gray"}`}>
                  My Pages
                </Link>
              </>
            )}
            {user.role === "admin" && (
              <>
                <Link href="/stat" className={`flex items-center gap-1 ${isActive("/stat") ? "text-accent-ink" : "text-ink-gray"}`}>
                  Stats
                </Link>
                <Link href="/management" className={`flex items-center gap-1 ${isActive("/management") ? "text-accent-ink" : "text-ink-gray"}`}>
                  Management
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full border-t border-paper-border bg-paper/60 py-8 text-center text-xs text-ink-gray mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="book-title text-sm tracking-tight text-ink font-semibold">OpenPages</span>
            <span className="text-paper-border">|</span>
            <span>Where creativity meets contemplation.</span>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <Link href="/pages" className="hover:text-ink transition-colors">Pages</Link>
            <Link href="/about" className="hover:text-ink transition-colors">About</Link>
          </div>
          <p className="text-[11px]">
            &copy; {new Date().getFullYear()} OpenPages. Crafted with a mat paper aesthetic.
          </p>
        </div>
      </div>
    </footer>
  );
}
