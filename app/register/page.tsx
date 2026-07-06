"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Key, Mail, User, ShieldAlert, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function Register() {
  const { user, register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"writer" | "admin">("writer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, role, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Email might already be taken.");
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-ink-gray book-body">
            Already have a library card?{" "}
            <Link href="/login" className="font-semibold text-accent-ink hover:text-accent-ink-hover border-b border-accent-ink/20">
              Sign in
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
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                <User size={16} />
              </span>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                placeholder="Clara Inkwell"
              />
            </div>
          </div>

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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                role === "writer"
                  ? "bg-accent-ink/5 border-accent-ink text-accent-ink"
                  : "border-paper-border hover:bg-black/5 text-ink-gray"
              }`}>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase">Writer</span>
                  <span className="text-[10px] opacity-80">Publish posts & comment</span>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="writer"
                  checked={role === "writer"}
                  onChange={() => setRole("writer")}
                  className="sr-only"
                />
                <Sparkles size={16} className={role === "writer" ? "text-accent-ink" : "text-ink-gray/40"} />
              </label>

              <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                role === "admin"
                  ? "bg-accent-ink/5 border-accent-ink text-accent-ink"
                  : "border-paper-border hover:bg-black/5 text-ink-gray"
              }`}>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase">Admin</span>
                  <span className="text-[10px] opacity-80">Dashboard & moderation</span>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="sr-only"
                />
                <BookOpen size={16} className={role === "admin" ? "text-accent-ink" : "text-ink-gray/40"} />
              </label>
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-lg border border-paper-border bg-paper text-sm text-ink focus:border-accent-ink focus:ring-1 focus:ring-accent-ink outline-none transition-colors"
                placeholder="•••••••• (6+ chars)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-gray mb-1.5" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink-gray/60">
                <Key size={16} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </>
            ) : (
              <>
                Create My Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
