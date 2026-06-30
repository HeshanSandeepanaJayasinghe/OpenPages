"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  actionIsSupabaseConfigured,
  actionGetProfileByEmail,
  actionCreateProfile,
  actionGetProfileById,
  actionUpdateProfile,
} from "@/app/actions/dbActions";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: "writer" | "admin";
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isLive: boolean;
  login: (email: string, password: string) => Promise<UserSession>;
  register: (name: string, email: string, role: "writer" | "admin", password: string) => Promise<UserSession>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserSession>) => Promise<UserSession>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isEnvConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder" && supabaseAnonKey !== "placeholder");

let supabaseClient: SupabaseClient | null = null;
if (isEnvConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client in browser context:", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function initSession() {
      try {
        const live = await actionIsSupabaseConfigured();
        setIsLive(live);

        if (live && supabaseClient) {
          // Live Supabase Authentication
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) {
            const profile = await actionGetProfileById(session.user.id);
            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                avatar_url: profile.avatar_url,
                role: profile.role,
              });
            }
          }

          // Listen to changes
          const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (event, currentSession) => {
              if (currentSession?.user) {
                const profile = await actionGetProfileById(currentSession.user.id);
                if (profile) {
                  setUser({
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                  });
                }
              } else {
                setUser(null);
              }
              setLoading(false);
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } else {
          // Local Storage Mock Authentication
          const savedUserId = localStorage.getItem("openpages_session_user_id");
          if (savedUserId) {
            const profile = await actionGetProfileById(savedUserId);
            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                avatar_url: profile.avatar_url,
                role: profile.role,
              });
            } else {
              localStorage.removeItem("openpages_session_user_id");
            }
          }
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, []);

  const login = async (email: string, password: string): Promise<UserSession> => {
    setLoading(true);
    try {
      if (isLive && supabaseClient) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (!data.user) throw new Error("No user returned");

        const profile = await actionGetProfileById(data.user.id);
        if (!profile) throw new Error("Profile not found for authenticated user");

        const sessionUser: UserSession = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: profile.role,
        };
        setUser(sessionUser);
        return sessionUser;
      } else {
        // Mock Login
        const profile = await actionGetProfileByEmail(email);
        if (!profile) {
          throw new Error("Invalid email or password");
        }

        // Simulating password validation (any matching mock user accepts their demo password or writer123 / admin123)
        const isDemoAdmin = email === "admin@openpages.com" && password === "admin123";
        const isDemoWriter = email === "writer@openpages.com" && password === "writer123";
        const isDemoWriter2 = email === "writer2@openpages.com" && password === "writer123";
        const isDefaultTest = password === "password" || password === "writer123" || password === "admin123";

        if (isDemoAdmin || isDemoWriter || isDemoWriter2 || isDefaultTest) {
          const sessionUser: UserSession = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            avatar_url: profile.avatar_url,
            role: profile.role,
          };
          localStorage.setItem("openpages_session_user_id", profile.id);
          setUser(sessionUser);
          return sessionUser;
        } else {
          throw new Error("Invalid credentials. Try demo credentials or password 'password'.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    role: "writer" | "admin",
    password: string
  ): Promise<UserSession> => {
    setLoading(true);
    try {
      if (isLive && supabaseClient) {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            },
          },
        });
        if (error) throw error;
        if (!data.user) throw new Error("Registration failed");

        // Create user profile in profiles table
        const profile = await actionCreateProfile({
          id: data.user.id,
          name,
          email,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
          role,
          created_at: new Date().toISOString(),
        });

        const sessionUser: UserSession = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: profile.role,
        };
        setUser(sessionUser);
        return sessionUser;
      } else {
        // Mock Registration
        const existing = await actionGetProfileByEmail(email);
        if (existing) {
          throw new Error("Email already registered");
        }

        const mockId = `mock-uuid-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
        const profile = await actionCreateProfile({
          id: mockId,
          name,
          email,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
          role,
          created_at: new Date().toISOString(),
        });

        const sessionUser: UserSession = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          role: profile.role,
        };
        localStorage.setItem("openpages_session_user_id", profile.id);
        setUser(sessionUser);
        return sessionUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isLive && supabaseClient) {
        await supabaseClient.auth.signOut();
      } else {
        localStorage.removeItem("openpages_session_user_id");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<UserSession>): Promise<UserSession> => {
    if (!user) throw new Error("No authenticated user");
    
    // Create mapping to profile shape
    const profileUpdates = {
      ...(updates.name && { name: updates.name }),
      ...(updates.avatar_url && { avatar_url: updates.avatar_url }),
      ...(updates.role && { role: updates.role }),
    };

    const updatedProfile = await actionUpdateProfile(user.id, profileUpdates);
    const updatedSessionUser: UserSession = {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      avatar_url: updatedProfile.avatar_url,
      role: updatedProfile.role,
    };
    setUser(updatedSessionUser);
    return updatedSessionUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLive, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
