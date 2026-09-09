/**
 * Shared TypeScript types for CareerOS.
 */

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActionState<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; details?: Record<string, string[]> };

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type NavItem = {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────────────────────

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION STATUS LABELS
// ─────────────────────────────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  SAVED: "Saved",
  INTERESTED: "Interested",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  FINAL_INTERVIEW: "Final Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  ARCHIVED: "Archived",
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-slate-100 text-slate-700",
  INTERESTED: "bg-blue-100 text-blue-700",
  APPLIED: "bg-indigo-100 text-indigo-700",
  SCREENING: "bg-yellow-100 text-yellow-700",
  INTERVIEW: "bg-orange-100 text-orange-700",
  FINAL_INTERVIEW: "bg-purple-100 text-purple-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};
