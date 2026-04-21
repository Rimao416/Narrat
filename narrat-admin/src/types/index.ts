// ─── Enums ────────────────────────────────────────────────────────────────────

export type Language = "FR" | "EN" | "LN" | "SW";
export type UserRole = "USER" | "MODERATOR" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
export type SpiritualLevel = "NEW_BELIEVER" | "BELIEVER" | "ESTABLISHED" | "LEADER" | "PASTOR";
export type ContentStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" | "REJECTED";

export type BookCategory =
  | "THEOLOGY"
  | "BIOGRAPHY"
  | "SPIRITUAL_GROWTH"
  | "PRAYER"
  | "MARRIAGE_FAMILY"
  | "FINANCES"
  | "SPIRITUAL_WARFARE"
  | "APOLOGETICS"
  | "CHURCH_HISTORY"
  | "ESCHATOLOGY"
  | "SENSITIVE_TOPICS"
  | "YOUTH_IDENTITY";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type ChallengeCategory =
  | "PURITY"
  | "MENTAL_HEALTH"
  | "PRAYER"
  | "BIBLE_READING"
  | "FASTING"
  | "FORGIVENESS"
  | "ANGER"
  | "GRATITUDE"
  | "EVANGELISM"
  | "FAMILY";

export type ChallengeIntensity = "LIGHT" | "MODERATE" | "INTENSE";

export type ConfessionType =
  | "CONFESSION"
  | "TESTIMONY"
  | "PRAYER_REQUEST"
  | "SPIRITUAL_QUESTION"
  | "ENCOURAGEMENT";

export type ModerationReason =
  | "INAPPROPRIATE"
  | "HERESY"
  | "SPAM"
  | "HARMFUL_CONTENT"
  | "IMMINENT_DANGER"
  | "FALSE_INFORMATION";

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
  bannedAt?: string;
  bannedReason?: string;
  language: Language;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    confessions: number;
    prayerRequests: number;
    courseEnrollments: number;
    userBadges?: number;
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
  authorId: string;
  author: Author;
  viewCount: number;
  downloadCount: number;
  language: Language;
  hasAudio: boolean;
  isSensitive: boolean;
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
  avatarUrl?: string;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverUrl?: string;
  level: CourseLevel;
  status: ContentStatus;
  moduleCount: number;
  enrollCount: number;
  passingScore: number;
  totalDuration?: number;
  hasCertificate: boolean;
  language: Language;
  createdAt: string;
  updatedAt: string;
  _count?: { modules: number; enrollments: number };
}

// ─── Songs ────────────────────────────────────────────────────────────────────

export interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string;
  imageUrl?: string;
  audioUrl?: string;
  style: string;
  theme: string;
  language: Language;
  status: ContentStatus;
  lyrics?: string;
  spiritualContext?: string;
  playCount: number;
  createdAt: string;
}

// ─── Confessions ──────────────────────────────────────────────────────────────

export interface Confession {
  id: string;
  type: ConfessionType;
  content: string;
  visibility: "PUBLIC" | "THEMATIC_GROUP" | "PRIVATE_GROUP" | "ANONYMOUS_PUBLIC";
  prayerCount: number;
  replyCount: number;
  isActive: boolean;
  hasCrisisFlag: boolean;
  isAnonymous: boolean;
  createdAt: string;
  user: Pick<AdminUser, "id" | "firstName" | "lastName" | "avatarUrl">;
}

// ─── Challenges ───────────────────────────────────────────────────────────────

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  intensity: ChallengeIntensity;
  durationDays: number;
  participantCount: number;
  completionRate: number;
  status: ContentStatus;
  coverUrl?: string;
  language: Language;
  isSensitive: boolean;
  createdAt: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  reason: ModerationReason;
  description?: string;
  isResolved: boolean;
  isCrisis: boolean;
  createdAt: string;
  submitter: Pick<AdminUser, "id" | "firstName" | "lastName">;
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
