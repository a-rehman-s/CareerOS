"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/helpers";
import type { ActionState } from "@/types";
import {
  profileUpdateSchema,
  educationSchema,
  experienceSchema,
  skillSchema,
  projectSchema,
  certificationSchema,
  achievementSchema,
  professionalLinkSchema,
} from "@/validators/profile";
import { slugify } from "@/lib/utils";

// Services
import { upsertProfile } from "@/services/profile.service";
import { createEducation, updateEducation, deleteEducation } from "@/services/education.service";
import { createExperience, updateExperience, deleteExperience } from "@/services/experience.service";
import { createSkill, updateSkill, deleteSkill } from "@/services/skill.service";
import { createProject, updateProject, deleteProject } from "@/services/project.service";
import { createCertification, updateCertification, deleteCertification } from "@/services/certification.service";
import { createAchievement, updateAchievement, deleteAchievement } from "@/services/achievement.service";
import { createLink, updateLink, deleteLink } from "@/services/link.service";

const PROFILE_PATH = "/dashboard/profile";

// ─── Helper ───────────────────────────────────────────────────────────────────

function parseFormData(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      const arrayKey = key.slice(0, -2);
      if (!obj[arrayKey]) obj[arrayKey] = [];
      (obj[arrayKey] as string[]).push(value as string);
    } else if (value === "true") {
      obj[key] = true;
    } else if (value === "false") {
      obj[key] = false;
    } else if (value === "") {
      obj[key] = null;
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = profileUpdateSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await upsertProfile(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Profile updated" };
  } catch {
    return { success: false, error: "Failed to update profile" };
  }
}

// ─── Education ────────────────────────────────────────────────────────────────

export async function createEducationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = educationSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createEducation(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Education added" };
  } catch {
    return { success: false, error: "Failed to add education" };
  }
}

export async function updateEducationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = educationSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateEducation(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Education updated" };
  } catch {
    return { success: false, error: "Failed to update education" };
  }
}

export async function deleteEducationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteEducation(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Education removed" };
  } catch {
    return { success: false, error: "Failed to remove education" };
  }
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function createExperienceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = experienceSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createExperience(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Experience added" };
  } catch {
    return { success: false, error: "Failed to add experience" };
  }
}

export async function updateExperienceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = experienceSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateExperience(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Experience updated" };
  } catch {
    return { success: false, error: "Failed to update experience" };
  }
}

export async function deleteExperienceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteExperience(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Experience removed" };
  } catch {
    return { success: false, error: "Failed to remove experience" };
  }
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export async function createSkillAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = skillSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createSkill(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Skill added" };
  } catch {
    return { success: false, error: "Failed to add skill" };
  }
}

export async function updateSkillAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = skillSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateSkill(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Skill updated" };
  } catch {
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkillAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteSkill(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Skill removed" };
  } catch {
    return { success: false, error: "Failed to remove skill" };
  }
}

// ─── Project ──────────────────────────────────────────────────────────────────

export async function createProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const raw = parseFormData(formData);
  if (!raw.slug && raw.name) raw.slug = slugify(raw.name as string);
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createProject(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Project added" };
  } catch {
    return { success: false, error: "Failed to add project" };
  }
}

export async function updateProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = projectSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateProject(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Project updated" };
  } catch {
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteProject(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Project removed" };
  } catch {
    return { success: false, error: "Failed to remove project" };
  }
}

// ─── Certification ────────────────────────────────────────────────────────────

export async function createCertificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = certificationSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createCertification(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Certification added" };
  } catch {
    return { success: false, error: "Failed to add certification" };
  }
}

export async function updateCertificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = certificationSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateCertification(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Certification updated" };
  } catch {
    return { success: false, error: "Failed to update certification" };
  }
}

export async function deleteCertificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteCertification(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Certification removed" };
  } catch {
    return { success: false, error: "Failed to remove certification" };
  }
}

// ─── Achievement ──────────────────────────────────────────────────────────────

export async function createAchievementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = achievementSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createAchievement(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Achievement added" };
  } catch {
    return { success: false, error: "Failed to add achievement" };
  }
}

export async function updateAchievementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = achievementSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateAchievement(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Achievement updated" };
  } catch {
    return { success: false, error: "Failed to update achievement" };
  }
}

export async function deleteAchievementAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteAchievement(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Achievement removed" };
  } catch {
    return { success: false, error: "Failed to remove achievement" };
  }
}

// ─── Professional Links ───────────────────────────────────────────────────────

export async function createLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = professionalLinkSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await createLink(user.id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Link added" };
  } catch {
    return { success: false, error: "Failed to add link" };
  }
}

export async function updateLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = professionalLinkSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateLink(user.id, id, parsed.data);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Link updated" };
  } catch {
    return { success: false, error: "Failed to update link" };
  }
}

export async function deleteLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteLink(user.id, id);
    revalidatePath(PROFILE_PATH);
    return { success: true, message: "Link removed" };
  } catch {
    return { success: false, error: "Failed to remove link" };
  }
}
