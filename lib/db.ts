import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isLiveDb = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder" && supabaseAnonKey !== "placeholder");

export function isSupabaseConfigured() {
  return isLiveDb;
}

// Supabase client instance (only if configured)
const supabase = isLiveDb ? createClient(supabaseUrl, supabaseAnonKey) : null;

// File-based Mock Database Configuration
const MOCK_DB_FILE = path.join(process.cwd(), "lib", "mock_db.json");

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: "writer" | "admin";
  created_at: string;
  bio?: string;
  password?: string;
}

export interface Page {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_image: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  page_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ModerationLog {
  id: string;
  target_type: "post" | "comment";
  target_id: string;
  moderation_result: string;
  created_at: string;
}

interface MockDataSchema {
  profiles: Profile[];
  pages: Page[];
  comments: Comment[];
  moderation_logs: ModerationLog[];
}

const INITIAL_MOCK_DATA: MockDataSchema = {
  profiles: [
    {
      id: "admin-uuid-1111-2222-333333333333",
      name: "Arthur Pendelton (Admin)",
      email: "admin@openpages.com",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      role: "admin",
      bio: "Head librarian and platform moderator.",
      password: "admin123",
      created_at: new Date("2026-06-01T08:00:00Z").toISOString(),
    },
    {
      id: "writer-uuid-1111-2222-333333333333",
      name: "Clara Inkwell (Writer)",
      email: "writer@openpages.com",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      role: "writer",
      bio: "A passionate writer exploring the bounds of physical and digital print.",
      password: "writer123",
      created_at: new Date("2026-06-02T10:00:00Z").toISOString(),
    },
    {
      id: "writer2-uuid-1111-2222-333333333333",
      name: "Homer Page (Writer)",
      email: "writer2@openpages.com",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      role: "writer",
      bio: "Savoring the quiet details of books and marginalia.",
      password: "writer123",
      created_at: new Date("2026-06-03T14:30:00Z").toISOString(),
    },
  ],
  pages: [
    {
      id: "page-uuid-1111-2222-333333333333",
      author_id: "writer-uuid-1111-2222-333333333333",
      title: "Why Paper Matters in a Digital Age",
      content: "There is an unspoken romance in the texture of a page. Unlike the glowing, clinical screen of a smartphone, a page does not request your attention with notifications or pop-ups. It is static, patient, and quiet. In our rush to digitize everything, we have traded the tactile intimacy of books for the cold efficiency of digital pixels. Reading from paper invites contemplation; it slower, more focused, and ultimately deeper. When we touch paper, we touch history, craft, and a slower way of being.",
      cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
      status: "published",
      created_at: new Date("2026-06-05T09:00:00Z").toISOString(),
      updated_at: new Date("2026-06-05T09:00:00Z").toISOString(),
    },
    {
      id: "page-uuid-2222-3333-444444444444",
      author_id: "writer2-uuid-1111-2222-333333333333",
      title: "Borges and the Infinite Library",
      content: "Jorge Luis Borges once envisioned the universe as an infinite library—the Library of Babel—containing every possible combination of letters. While it contains all truths, it also contains all lies, gibberish, and nonsense. Our modern internet feels remarkably similar. The challenge of our time is not the acquisition of information, but the navigation of it. We must find the 'catalog' to our own infinite libraries, filtering out the noise to hold on to the rare, brilliant volumes of human insight.",
      cover_image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800",
      status: "published",
      created_at: new Date("2026-06-10T11:15:00Z").toISOString(),
      updated_at: new Date("2026-06-10T11:15:00Z").toISOString(),
    },
    {
      id: "page-uuid-3333-4444-555555555555",
      author_id: "writer-uuid-1111-2222-333333333333",
      title: "Pencil Markings and Marginalia (Draft)",
      content: "This is a draft about marginalia—the custom of writing notes, thoughts, and critiques in the margins of library books. It is a dialogue between the reader and the author across centuries. More thoughts to follow on this soon...",
      cover_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
      status: "draft",
      created_at: new Date("2026-06-20T16:45:00Z").toISOString(),
      updated_at: new Date("2026-06-20T16:45:00Z").toISOString(),
    },
  ],
  comments: [
    {
      id: "comment-uuid-1111-2222-333333333333",
      page_id: "page-uuid-1111-2222-333333333333",
      user_id: "writer2-uuid-1111-2222-333333333333",
      content: "This resonates deeply. Holding a physical book slows down my breathing, whereas reading on a screen makes me scan impatiently.",
      created_at: new Date("2026-06-06T10:30:00Z").toISOString(),
    },
    {
      id: "comment-uuid-2222-3333-444444444444",
      page_id: "page-uuid-1111-2222-333333333333",
      user_id: "admin-uuid-1111-2222-333333333333",
      content: "Excellent mini-essay, Clara. It captures the exact spirit of why we created OpenPages—to slow down and savor human thoughts.",
      created_at: new Date("2026-06-07T12:00:00Z").toISOString(),
    },
  ],
  moderation_logs: [
    {
      id: "mod-log-1",
      target_type: "comment",
      target_id: "comment-uuid-1111-2222",
      moderation_result: "Clean",
      created_at: new Date("2026-06-06T10:30:00Z").toISOString(),
    },
  ],
};

function readMockDb(): MockDataSchema {
  try {
    if (!fs.existsSync(MOCK_DB_FILE)) {
      const dir = path.dirname(MOCK_DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(INITIAL_MOCK_DATA, null, 2));
      return INITIAL_MOCK_DATA;
    }
    const raw = fs.readFileSync(MOCK_DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading mock database file:", err);
    return INITIAL_MOCK_DATA;
  }
}

function writeMockDb(data: MockDataSchema) {
  try {
    const dir = path.dirname(MOCK_DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing mock database file:", err);
  }
}

// Helper to perform safe database calls with local mock database fallback
async function safeDbCall<T>(call: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (isLiveDb && supabase) {
    try {
      return await call();
    } catch (err) {
      console.warn("Supabase query failed, falling back to mock database:", err);
      return await fallback();
    }
  }
  return await fallback();
}

// Global Database API wrapper functions (Server-side)

export async function getProfiles(): Promise<Profile[]> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("profiles").select("*");
      if (error) throw error;
      return data || [];
    },
    () => readMockDb().profiles
  );
}

export async function getProfileById(id: string): Promise<Profile | null> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    () => {
      const db = readMockDb();
      return db.profiles.find((p) => p.id === id) || null;
    }
  );
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("profiles").select("*").eq("email", email).maybeSingle();
      if (error) throw error;
      return data;
    },
    () => {
      const db = readMockDb();
      return db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()) || null;
    }
  );
}

export async function createProfile(profile: Profile): Promise<Profile> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("profiles").insert(profile).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      if (db.profiles.some((p) => p.id === profile.id || p.email.toLowerCase() === profile.email.toLowerCase())) {
        throw new Error("Profile already exists with this ID or email.");
      }
      db.profiles.push(profile);
      writeMockDb(db);
      return profile;
    }
  );
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("profiles").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      const idx = db.profiles.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Profile not found");
      db.profiles[idx] = { ...db.profiles[idx], ...updates };
      writeMockDb(db);
      return db.profiles[idx];
    }
  );
}

export async function deleteProfile(id: string): Promise<boolean> {
  return safeDbCall(
    async () => {
      const { error } = await supabase!.from("profiles").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    async () => {
      const db = readMockDb();
      const lenBefore = db.profiles.length;
      db.profiles = db.profiles.filter((p) => p.id !== id);
      db.pages = db.pages.filter((p) => p.author_id !== id);
      db.comments = db.comments.filter((c) => c.user_id !== id);
      writeMockDb(db);
      return db.profiles.length < lenBefore;
    }
  );
}

// Pages CRUD
export async function getPages(): Promise<Page[]> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("pages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    () => {
      return [...readMockDb().pages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  );
}

export async function getPageById(id: string): Promise<Page | null> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("pages").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    () => {
      const db = readMockDb();
      return db.pages.find((p) => p.id === id) || null;
    }
  );
}

export async function createPage(page: Page): Promise<Page> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("pages").insert(page).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      db.pages.push(page);
      writeMockDb(db);
      return page;
    }
  );
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<Page> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("pages").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      const idx = db.pages.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Page not found");
      db.pages[idx] = { ...db.pages[idx], ...updates, updated_at: new Date().toISOString() };
      writeMockDb(db);
      return db.pages[idx];
    }
  );
}

export async function deletePage(id: string): Promise<boolean> {
  return safeDbCall(
    async () => {
      const { error } = await supabase!.from("pages").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    async () => {
      const db = readMockDb();
      const lenBefore = db.pages.length;
      db.pages = db.pages.filter((p) => p.id !== id);
      db.comments = db.comments.filter((c) => c.page_id !== id);
      writeMockDb(db);
      return db.pages.length < lenBefore;
    }
  );
}

// Comments CRUD
export async function getComments(pageId?: string): Promise<Comment[]> {
  return safeDbCall(
    async () => {
      let query = supabase!.from("comments").select("*").order("created_at", { ascending: true });
      if (pageId) {
        query = query.eq("page_id", pageId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    () => {
      let list = readMockDb().comments;
      if (pageId) {
        list = list.filter((c) => c.page_id === pageId);
      }
      return [...list].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
  );
}

export async function createComment(comment: Comment): Promise<Comment> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("comments").insert(comment).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      db.comments.push(comment);
      writeMockDb(db);
      return comment;
    }
  );
}

export async function deleteComment(id: string): Promise<boolean> {
  return safeDbCall(
    async () => {
      const { error } = await supabase!.from("comments").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    async () => {
      const db = readMockDb();
      const lenBefore = db.comments.length;
      db.comments = db.comments.filter((c) => c.id !== id);
      writeMockDb(db);
      return db.comments.length < lenBefore;
    }
  );
}

// Moderation Logs CRUD
export async function getModerationLogs(): Promise<ModerationLog[]> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("moderation_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    () => {
      return [...readMockDb().moderation_logs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  );
}

export async function createModerationLog(log: ModerationLog): Promise<ModerationLog> {
  return safeDbCall(
    async () => {
      const { data, error } = await supabase!.from("moderation_logs").insert(log).select().single();
      if (error) throw error;
      return data;
    },
    async () => {
      const db = readMockDb();
      db.moderation_logs.push(log);
      writeMockDb(db);
      return log;
    }
  );
}
