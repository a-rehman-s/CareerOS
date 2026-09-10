/**
 * Profile Service
 * All database access for the user's career profile.
 */
import { db } from "@/lib/db";
import type { ProfileUpdateInput } from "@/validators/profile";

/**
 * Get a user's profile (or null if not yet created).
 */
export async function getProfile(userId: string) {
  return db.profile.findUnique({
    where: { userId },
  });
}

/**
 * Upsert the user's profile. Creates it if it doesn't exist.
 */
export async function upsertProfile(userId: string, data: ProfileUpdateInput) {
  return db.profile.upsert({
    where: { userId },
    update: {
      ...data,
      website: data.website || null,
      publicEmail: data.publicEmail || null,
    },
    create: {
      userId,
      ...data,
      website: data.website || null,
      publicEmail: data.publicEmail || null,
    },
  });
}

/**
 * Get a full career summary for the authenticated user.
 * Used by the dashboard overview.
 */
export async function getCareerSummary(userId: string) {
  const [profile, education, experience, skills, projects, certifications, achievements, links] =
    await Promise.all([
      db.profile.findUnique({ where: { userId } }),
      db.education.findMany({ where: { userId }, orderBy: { order: "asc" } }),
      db.experience.findMany({ where: { userId }, orderBy: { order: "asc" } }),
      db.skill.findMany({ where: { userId }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
      db.project.findMany({ where: { userId }, orderBy: { order: "asc" } }),
      db.certification.findMany({ where: { userId }, orderBy: { order: "asc" } }),
      db.achievement.findMany({ where: { userId }, orderBy: { order: "asc" } }),
      db.professionalLink.findMany({ where: { userId }, orderBy: { order: "asc" } }),
    ]);

  return { profile, education, experience, skills, projects, certifications, achievements, links };
}

/**
 * Calculate a simple profile completeness score (0–100).
 */
export function calculateProfileScore(summary: Awaited<ReturnType<typeof getCareerSummary>>): number {
  let score = 0;
  const { profile, education, experience, skills, projects } = summary;

  if (profile?.professionalTitle) score += 10;
  if (profile?.professionalSummary) score += 15;
  if (profile?.location) score += 5;
  if (education.length > 0) score += 15;
  if (experience.length > 0) score += 20;
  if (skills.length >= 5) score += 15;
  if (skills.length >= 10) score += 5;
  if (projects.length > 0) score += 10;
  if (projects.length >= 3) score += 5;

  return Math.min(score, 100);
}
