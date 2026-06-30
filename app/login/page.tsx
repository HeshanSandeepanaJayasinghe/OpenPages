"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Key, Mail, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/stat");
      } else {
        router.push("/mypage");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: "admin" | "writer") => {
    setError(null);
    setIsSubmitting(true);
    const demoEmail = role === "admin" ? "admin@openpages.com" : "writer@openpages.com";
    const demoPassword = role === "admin" ? "admin123" : "writer123";
    try {
      await login(demoEmail, demoPassword);
    } catch (err: any) {
      setError(err?.message || `Failed to log in as demo ${role}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md paper-sheet p-8 rounded-xl relative">
        <div className="text-center mb-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-ink text-paper shadow-sm mb-4">
            <BookOpen size={24} />
          </span>
          <h2 className="book-title text-3xl font-extrabold text-ink">
            Sign in to your library
          </h2>
          <p className="mt-2 text-sm text-ink-gray book-body">
            Or{" "}
            <Link href="/register" className="font-semibold text-accent-ink hover:text-accent-ink-hover border-b border-accent-ink/20">
              create a new page
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                <Key size={16} />
              </span>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-accent-ink hover:bg-accent-ink-hover text-paper text-sm font-semibold shadow-paper hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Open My Library
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Section */}
        <div className="mt-8 pt-6 border-t border-paper-border/60">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-ink-gray mb-4">
            Developer / Demonstration Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDemoLogin("writer")}
              disabled={isSubmitting}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-paper-border bg-paper-dark/20 hover:bg-paper-dark/40 transition-colors text-left"
            >
              <span className="text-[10px] font-bold uppercase text-ink-gray">Writer Account</span>
              <span className="text-xs font-semibold text-accent-ink mt-0.5">Clara Inkwell</span>
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              disabled={isSubmitting}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-paper-border bg-paper-dark/20 hover:bg-paper-dark/40 transition-colors text-left"
            >
              <span className="text-[10px] font-bold uppercase text-ink-gray">Admin Account</span>
              <span className="text-xs font-semibold text-accent-ink mt-0.5">Arthur Pendelton</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
