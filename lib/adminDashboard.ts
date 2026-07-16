import type { Comment, ModerationLog, Page, Profile } from "@/lib/db";

export interface DashboardKpi {
  writers: number;
  admins: number;
  published: number;
  drafts: number;
  comments: number;
  moderationEvents: number;
  flaggedEvents: number;
}

export interface ActivityPoint {
  month: string;
  posts: number;
  comments: number;
  moderation: number;
}

export interface ContentMixSlice {
  name: string;
  value: number;
  color: string;
}

export interface RecentPageRow {
  id: string;
  title: string;
  status: Page["status"];
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  commentCount: number;
}

export interface ModerationPulseItem {
  id: string;
  result: string;
  targetType: ModerationLog["target_type"];
  targetId: string;
  createdAt: string;
  flagged: boolean;
}

export interface TopWriterRow {
  id: string;
  name: string;
  avatarUrl: string;
  publishedCount: number;
}

export interface AdminDashboardSummary {
  kpis: DashboardKpi;
  activity: ActivityPoint[];
  contentMix: ContentMixSlice[];
  recentPages: RecentPageRow[];
  moderationPulse: ModerationPulseItem[];
  topWriters: TopWriterRow[];
  roleMix: { writers: number; admins: number };
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export function isFlaggedModeration(result: string): boolean {
  const normalized = result.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === "clean" || normalized.startsWith("clean")) return false;
  return true;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildActivitySeries(
  pages: Page[],
  comments: Comment[],
  logs: ModerationLog[],
  monthsBack = 7,
): ActivityPoint[] {
  const now = new Date();
  const buckets: ActivityPoint[] = [];
  const indexByKey = new Map<string, number>();

  for (let i = monthsBack - 1; i >= 0; i -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(cursor);
    indexByKey.set(key, buckets.length);
    buckets.push({
      month: MONTH_LABELS[cursor.getMonth()],
      posts: 0,
      comments: 0,
      moderation: 0,
    });
  }

  const bump = (iso: string, field: "posts" | "comments" | "moderation") => {
    const key = monthKey(new Date(iso));
    const idx = indexByKey.get(key);
    if (idx === undefined) return;
    buckets[idx][field] += 1;
  };

  for (const page of pages) bump(page.created_at, "posts");
  for (const comment of comments) bump(comment.created_at, "comments");
  for (const log of logs) bump(log.created_at, "moderation");

  return buckets;
}

/**
 * Pure aggregation over existing domain entities.
 * Isolated so it can later be replaced by a dedicated analytics endpoint.
 */
export function buildAdminDashboardSummary(
  profiles: Profile[],
  pages: Page[],
  comments: Comment[],
  logs: ModerationLog[],
): AdminDashboardSummary {
  const writers = profiles.filter((p) => p.role === "writer");
  const admins = profiles.filter((p) => p.role === "admin");
  const published = pages.filter((p) => p.status === "published");
  const drafts = pages.filter((p) => p.status === "draft");
  const flaggedEvents = logs.filter((l) => isFlaggedModeration(l.moderation_result)).length;

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const commentsByPage = new Map<string, number>();
  for (const comment of comments) {
    commentsByPage.set(comment.page_id, (commentsByPage.get(comment.page_id) ?? 0) + 1);
  }

  const recentPages: RecentPageRow[] = [...pages]
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    .slice(0, 6)
    .map((page) => {
      const author = profileById.get(page.author_id);
      return {
        id: page.id,
        title: page.title,
        status: page.status,
        authorName: author?.name ?? "Unknown author",
        authorAvatar: author?.avatar_url ?? "",
        createdAt: page.created_at,
        commentCount: commentsByPage.get(page.id) ?? 0,
      };
    });

  const moderationPulse: ModerationPulseItem[] = [...logs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map((log) => ({
      id: log.id,
      result: log.moderation_result,
      targetType: log.target_type,
      targetId: log.target_id,
      createdAt: log.created_at,
      flagged: isFlaggedModeration(log.moderation_result),
    }));

  const publishedByAuthor = new Map<string, number>();
  for (const page of published) {
    publishedByAuthor.set(page.author_id, (publishedByAuthor.get(page.author_id) ?? 0) + 1);
  }

  const topWriters: TopWriterRow[] = writers
    .map((writer) => ({
      id: writer.id,
      name: writer.name,
      avatarUrl: writer.avatar_url,
      publishedCount: publishedByAuthor.get(writer.id) ?? 0,
    }))
    .sort((a, b) => b.publishedCount - a.publishedCount)
    .slice(0, 3);

  const publishedCount = published.length;
  const draftCount = drafts.length;

  return {
    kpis: {
      writers: writers.length,
      admins: admins.length,
      published: publishedCount,
      drafts: draftCount,
      comments: comments.length,
      moderationEvents: logs.length,
      flaggedEvents,
    },
    activity: buildActivitySeries(pages, comments, logs),
    contentMix: [
      { name: "Published", value: publishedCount, color: "#8b2626" },
      { name: "Drafts", value: draftCount, color: "#c4a574" },
    ].filter((slice) => slice.value > 0),
    recentPages,
    moderationPulse,
    topWriters,
    roleMix: { writers: writers.length, admins: admins.length },
  };
}
