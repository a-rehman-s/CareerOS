import { z } from "zod";

// ─── Resume ───────────────────────────────────────────────────────────────────

export const resumeSchema = z.object({
  name: z.string().min(1, "Resume name is required").max(100, "Name too long"),
  description: z.string().max(500).optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

export type ResumeInput = z.infer<typeof resumeSchema>;

// ─── Resume Version ───────────────────────────────────────────────────────────

/**
 * The structured JSON content stored inside a ResumeVersion.
 * Stores which profile item IDs are selected for this resume version.
 */
export const resumeContentSchema = z.object({
  summary: z.string().max(3000).optional().nullable(),
  selectedExperienceIds: z.array(z.string()).default([]),
  selectedEducationIds: z.array(z.string()).default([]),
  selectedSkillIds: z.array(z.string()).default([]),
  selectedProjectIds: z.array(z.string()).default([]),
  selectedCertificationIds: z.array(z.string()).default([]),
  selectedAchievementIds: z.array(z.string()).default([]),
  customSections: z
    .array(
      z.object({
        title: z.string().max(100),
        items: z.array(z.string()),
      })
    )
    .optional()
    .default([]),
  targetRole: z.string().max(200).optional().nullable(),
  targetCompany: z.string().max(200).optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
});

export type ResumeContent = z.infer<typeof resumeContentSchema>;

export const resumeVersionSchema = z.object({
  label: z.string().max(100).optional().nullable(),
  targetRole: z.string().max(200).optional().nullable(),
  targetLevel: z.string().max(100).optional().nullable(),
  atsScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  content: resumeContentSchema.optional().default({
    selectedExperienceIds: [],
    selectedEducationIds: [],
    selectedSkillIds: [],
    selectedProjectIds: [],
    selectedCertificationIds: [],
    selectedAchievementIds: [],
    customSections: [],
    keywords: [],
  }),
});

export type ResumeVersionInput = z.infer<typeof resumeVersionSchema>;

// ─── Document ─────────────────────────────────────────────────────────────────

export const documentSchema = z.object({
  fileName: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(100),
  fileExtension: z.string().min(1).max(10),
  storagePath: z.string().min(1).max(1000),
  fileSize: z.number().int().positive(),
  documentType: z.string().max(50).optional().nullable(),
  resumeVersionId: z.string().optional().nullable(),
});

export type DocumentInput = z.infer<typeof documentSchema>;
