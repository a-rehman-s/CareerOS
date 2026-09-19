/**
 * Resume Service
 * All database access for resumes, resume versions, and their content.
 */
import { db } from "@/lib/db";
import type { ResumeInput, ResumeVersionInput, ResumeContent } from "@/validators/resume";

// ─── Resume CRUD ──────────────────────────────────────────────────────────────

/**
 * Get all resumes for a user, including their active version's metadata.
 */
export async function getResumes(userId: string) {
  return db.resume.findMany({
    where: { userId },
    include: {
      versions: {
        where: { isActive: true },
        take: 1,
        orderBy: { version: "desc" },
      },
      _count: { select: { versions: true } },
    },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
}

/**
 * Get one resume with all its versions (sorted newest first).
 */
export async function getResume(userId: string, id: string) {
  return db.resume.findFirst({
    where: { id, userId },
    include: {
      versions: { orderBy: { version: "desc" } },
    },
  });
}

/**
 * Create a new resume with a v1 empty version.
 */
export async function createResume(userId: string, data: ResumeInput) {
  // If this is set as default, clear others first
  if (data.isDefault) {
    await db.resume.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  return db.resume.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      isDefault: data.isDefault ?? false,
      versions: {
        create: {
          version: 1,
          label: "v1",
          isActive: true,
          content: {
            summary: null,
            selectedExperienceIds: [],
            selectedEducationIds: [],
            selectedSkillIds: [],
            selectedProjectIds: [],
            selectedCertificationIds: [],
            selectedAchievementIds: [],
            customSections: [],
            keywords: [],
          },
        },
      },
    },
    include: { versions: true },
  });
}

/**
 * Update a resume's metadata (name, description).
 */
export async function updateResume(userId: string, id: string, data: Partial<ResumeInput>) {
  const existing = await db.resume.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");

  if (data.isDefault) {
    await db.resume.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  return db.resume.update({ where: { id }, data });
}

/**
 * Delete a resume (cascades to all versions).
 */
export async function deleteResume(userId: string, id: string) {
  const existing = await db.resume.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.resume.delete({ where: { id } });
}

/**
 * Set a resume as the user's default.
 */
export async function setDefaultResume(userId: string, id: string) {
  const existing = await db.resume.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  await db.resume.updateMany({ where: { userId }, data: { isDefault: false } });
  return db.resume.update({ where: { id }, data: { isDefault: true } });
}

// ─── Resume Version CRUD ──────────────────────────────────────────────────────

/**
 * Create a new version of a resume.
 * Auto-increments version number, copies content from current active version.
 */
export async function createResumeVersion(
  userId: string,
  resumeId: string,
  data: ResumeVersionInput
) {
  const resume = await db.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new Error("Resume not found");

  // Get latest version number
  const latest = await db.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { version: "desc" },
  });
  const nextVersion = (latest?.version ?? 0) + 1;

  // Copy content from active version if no content provided
  let content = data.content;
  if (!content && latest) {
    content = latest.content as ResumeContent;
  }

  return db.resumeVersion.create({
    data: {
      resumeId,
      version: nextVersion,
      label: data.label ?? `v${nextVersion}`,
      targetRole: data.targetRole,
      targetLevel: data.targetLevel,
      atsScore: data.atsScore,
      notes: data.notes,
      isActive: false,
      content: content as object ?? {},
    },
  });
}

/**
 * Update a resume version's content and metadata.
 */
export async function updateResumeVersion(
  userId: string,
  id: string,
  data: Partial<ResumeVersionInput>
) {
  // Verify ownership via resume
  const version = await db.resumeVersion.findFirst({
    where: { id },
    include: { resume: { select: { userId: true } } },
  });
  if (!version || version.resume.userId !== userId) throw new Error("Not found");

  return db.resumeVersion.update({
    where: { id },
    data: {
      label: data.label,
      targetRole: data.targetRole,
      targetLevel: data.targetLevel,
      atsScore: data.atsScore,
      notes: data.notes,
      ...(data.content !== undefined && { content: data.content as object }),
    },
  });
}

/**
 * Delete a resume version. Cannot delete if it's the only version.
 */
export async function deleteResumeVersion(userId: string, id: string) {
  const version = await db.resumeVersion.findFirst({
    where: { id },
    include: { resume: { select: { userId: true, id: true } } },
  });
  if (!version || version.resume.userId !== userId) throw new Error("Not found");

  const count = await db.resumeVersion.count({ where: { resumeId: version.resume.id } });
  if (count <= 1) throw new Error("Cannot delete the only version of a resume");

  return db.resumeVersion.delete({ where: { id } });
}

/**
 * Set a specific version as the active one for its resume.
 */
export async function setActiveVersion(userId: string, resumeId: string, versionId: string) {
  const resume = await db.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new Error("Not found");

  await db.resumeVersion.updateMany({ where: { resumeId }, data: { isActive: false } });
  return db.resumeVersion.update({ where: { id: versionId }, data: { isActive: true } });
}

/**
 * Get a single version with full content.
 */
export async function getResumeVersion(userId: string, versionId: string) {
  const version = await db.resumeVersion.findFirst({
    where: { id: versionId },
    include: { resume: { select: { userId: true, name: true } } },
  });
  if (!version || version.resume.userId !== userId) return null;
  return version;
}
