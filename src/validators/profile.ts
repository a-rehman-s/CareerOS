/**
 * Zod validation schemas for all Career Profile sections.
 */
import { z } from "zod";

// ─── Profile ─────────────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  professionalTitle: z.string().max(120, "Title too long").optional().nullable(),
  professionalSummary: z.string().max(2000, "Summary too long").optional().nullable(),
  phone: z.string().max(30, "Phone too long").optional().nullable(),
  location: z.string().max(120, "Location too long").optional().nullable(),
  website: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  publicEmail: z.string().email("Must be a valid email").optional().nullable().or(z.literal("")),
  isPublic: z.boolean().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// ─── Education ────────────────────────────────────────────────────────────────

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(200),
  degree: z.string().max(100).optional().nullable(),
  field: z.string().max(100).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  cgpa: z.coerce.number().min(0).max(10).optional().nullable(),
  coursework: z.array(z.string()).optional().default([]),
  description: z.string().max(2000).optional().nullable(),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type EducationInput = z.infer<typeof educationSchema>;

// ─── Experience ───────────────────────────────────────────────────────────────

export const employmentTypeValues = [
  "FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE",
  "INTERNSHIP", "VOLUNTEER", "OTHER",
] as const;

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  employmentType: z.enum(employmentTypeValues).default("FULL_TIME"),
  location: z.string().max(120).optional().nullable(),
  isRemote: z.boolean().optional().default(false),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().max(3000).optional().nullable(),
  achievements: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

// ─── Skill ────────────────────────────────────────────────────────────────────

export const proficiencyValues = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(100),
  category: z.string().max(100).optional().nullable(),
  proficiency: z.enum(proficiencyValues).default("INTERMEDIATE"),
  yearsOfExperience: z.coerce.number().min(0).max(50).optional().nullable(),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().max(300).optional().nullable(),
  fullDescription: z.string().max(5000).optional().nullable(),
  problem: z.string().max(2000).optional().nullable(),
  solution: z.string().max(2000).optional().nullable(),
  technologies: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  contribution: z.string().max(2000).optional().nullable(),
  results: z.string().max(2000).optional().nullable(),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  liveUrl: z.string().url().optional().nullable().or(z.literal("")),
  documentationUrl: z.string().url().optional().nullable().or(z.literal("")),
  featured: z.boolean().optional().default(false),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required").max(200),
  issuer: z.string().min(1, "Issuer is required").max(200),
  issueDate: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  credentialId: z.string().max(200).optional().nullable(),
  credentialUrl: z.string().url().optional().nullable().or(z.literal("")),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ─── Achievement ──────────────────────────────────────────────────────────────

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  organization: z.string().max(200).optional().nullable(),
  date: z.string().optional().nullable(),
  url: z.string().url().optional().nullable().or(z.literal("")),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type AchievementInput = z.infer<typeof achievementSchema>;

// ─── Professional Link ────────────────────────────────────────────────────────

export const professionalLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required").max(50),
  url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  label: z.string().max(100).optional().nullable(),
  isPublic: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export type ProfessionalLinkInput = z.infer<typeof professionalLinkSchema>;
