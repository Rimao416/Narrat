// ─── Enums ────────────────────────────────────────────────────────────────────

export type Language = "FR" | "EN" | "LN" | "SW";
export type UserRole = "USER" | "MODERATOR" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
export type SpiritualLevel = "NEW_BELIEVER" | "BELIEVER" | "ESTABLISHED" | "LEADER" | "PASTOR";
export type ContentStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | "REJECTED";
export type BookCategory =
  | "THEOLOGY"
  | "PRAYER"
  | "MARRIAGE_FAMILY"
  | "LEADERSHIP"
  | "EVANGELISM"
  | "DEVOTIONAL"
  | "BIBLICAL_STUDY"
  | "SPIRITUAL_GROWTH"
  | "YOUTH"
  | "PROPHECY"
  | "HEALING"
  | "REVIVAL";
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ChallengeCategory =
  | "PURITY"
  | "MENTAL_HEALTH"
  | "PRAYER"
  | "FASTING"
  | "BIBLE_READING"
  | "SERVICE"
  | "EVANGELISM"
  | "WORSHIP"
  | "COMMUNITY"
  | "FINANCE";
export type ConfessionType =
  | "CONFESSION"
  | "TESTIMONY"
  | "PRAYER_REQUEST"
  | "PRAISE"
  | "QUESTION";
export type ReportReason =
  | "INAPPROPRIATE_CONTENT"
  | "SPAM"
  | "HARASSMENT"
  | "FAKE_INFO"
  | "OTHER";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AdminUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  role: UserRole;
  spiritualLevel: SpiritualLevel;
  xpTotal: number;
  isActive: boolean;
  isBanned: boolean;
  preferredLanguage: Language;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    confessions: number;
    prayerRequests: number;
    enrollments: number;
  };
}

export interface UsersListResponse {
  data: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Books ────────────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl?: string;
  audioUrl?: string;
  category: BookCategory;
  status: ContentStatus;
  isFeatured: boolean;
  totalPages?: number;
  author: Author;
  authorId: string;
  readCount: number;
  language: Language;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: { chapters: number };
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  photoUrl?: string;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  level: CourseLevel;
  status: ContentStatus;
  isFeatured: boolean;
  moduleCount: number;
  enrollCount: number;
  passingScore: number;
  estimatedHours?: number;
  language: Language;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Songs ────────────────────────────────────────────────────────────────────

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  audioUrl?: string;
  style: string;
  language: Language;
  status: ContentStatus;
  lyrics?: string;
  spiritualContext?: string;
  playCount: number;
  sortOrder: number;
  createdAt: string;
}

// ─── Confessions ──────────────────────────────────────────────────────────────

export interface Confession {
  id: string;
  type: ConfessionType;
  content: string;
  visibility: "PUBLIC" | "ANONYMOUS" | "COMMUNITY";
  prayerCount: number;
  replyCount: number;
  isApproved: boolean;
  isFlagged: boolean;
  createdAt: string;
  user: Pick<AdminUser, "id" | "firstName" | "lastName" | "profilePicture">;
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  intensity: "LIGHT" | "MODERATE" | "INTENSE";
  durationDays: number;
  participantCount: number;
  status: ContentStatus;
  isFeatured: boolean;
  coverUrl?: string;
  sortOrder: number;
  createdAt: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  reason: ReportReason;
  description?: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  reportedAt: string;
  reporter: Pick<AdminUser, "id" | "firstName" | "lastName">;
  reportedUser?: Pick<AdminUser, "id" | "firstName" | "lastName">;
  confession?: Pick<Confession, "id" | "content" | "type">;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  newUsersThisWeek: number;
  totalBooks: number;
  totalCourses: number;
  totalConfessions: number;
  pendingReports: number;
  pendingContent: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface UserGrowthData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
