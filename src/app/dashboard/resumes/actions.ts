"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/helpers";
import type { ActionState } from "@/types";
import { resumeSchema, resumeVersionSchema, resumeContentSchema } from "@/validators/resume";
import {
  createResume,
  updateResume,
  deleteResume,
  setDefaultResume,
  createResumeVersion,
  updateResumeVersion,
  deleteResumeVersion,
  setActiveVersion,
} from "@/services/resume.service";

const RESUMES_PATH = "/dashboard/resumes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFormData(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      const k = key.slice(0, -2);
      if (!obj[k]) obj[k] = [];
      (obj[k] as string[]).push(value as string);
    } else if (value === "true") obj[key] = true;
    else if (value === "false") obj[key] = false;
    else if (value === "") obj[key] = null;
    else obj[key] = value;
  }
  return obj;
}

// ─── Resume Actions ───────────────────────────────────────────────────────────

export async function createResumeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const parsed = resumeSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    const resume = await createResume(user.id, parsed.data);
    revalidatePath(RESUMES_PATH);
    return { success: true, message: "Resume created", data: resume.id as unknown as void };
  } catch {
    return { success: false, error: "Failed to create resume" };
  }
}

export async function updateResumeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = resumeSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateResume(user.id, id, parsed.data);
    revalidatePath(RESUMES_PATH);
    revalidatePath(`${RESUMES_PATH}/${id}`);
    return { success: true, message: "Resume updated" };
  } catch {
    return { success: false, error: "Failed to update resume" };
  }
}

export async function deleteResumeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteResume(user.id, id);
    revalidatePath(RESUMES_PATH);
    return { success: true, message: "Resume deleted" };
  } catch {
    return { success: false, error: "Failed to delete resume" };
  }
}

export async function setDefaultResumeAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await setDefaultResume(user.id, id);
    revalidatePath(RESUMES_PATH);
    return { success: true, message: "Default resume updated" };
  } catch {
    return { success: false, error: "Failed to update default" };
  }
}

// ─── Resume Version Actions ───────────────────────────────────────────────────

export async function createResumeVersionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const resumeId = formData.get("resumeId") as string;
  if (!resumeId) return { success: false, error: "Missing resume ID" };
  const parsed = resumeVersionSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    const version = await createResumeVersion(user.id, resumeId, parsed.data);
    revalidatePath(`${RESUMES_PATH}/${resumeId}`);
    return { success: true, message: "Version created", data: version.id as unknown as void };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create version" };
  }
}

export async function updateResumeVersionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  const resumeId = formData.get("resumeId") as string;
  if (!id) return { success: false, error: "Missing ID" };
  const parsed = resumeVersionSchema.partial().safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors };
  }
  try {
    await updateResumeVersion(user.id, id, parsed.data);
    revalidatePath(`${RESUMES_PATH}/${resumeId}`);
    return { success: true, message: "Version updated" };
  } catch {
    return { success: false, error: "Failed to update version" };
  }
}

export async function deleteResumeVersionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  const resumeId = formData.get("resumeId") as string;
  if (!id) return { success: false, error: "Missing ID" };
  try {
    await deleteResumeVersion(user.id, id);
    revalidatePath(`${RESUMES_PATH}/${resumeId}`);
    return { success: true, message: "Version removed" };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete version" };
  }
}

export async function setActiveVersionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const resumeId = formData.get("resumeId") as string;
  const versionId = formData.get("versionId") as string;
  if (!resumeId || !versionId) return { success: false, error: "Missing IDs" };
  try {
    await setActiveVersion(user.id, resumeId, versionId);
    revalidatePath(`${RESUMES_PATH}/${resumeId}`);
    return { success: true, message: "Active version updated" };
  } catch {
    return { success: false, error: "Failed to set active version" };
  }
}

/**
 * Save the structured content (selected IDs) for a resume version.
 * Called from the content editor with JSON body.
 */
export async function saveResumeContentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const id = formData.get("id") as string;
  const resumeId = formData.get("resumeId") as string;
  const rawContent = formData.get("content") as string;

  if (!id || !rawContent) return { success: false, error: "Missing required fields" };

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(rawContent);
  } catch {
    return { success: false, error: "Invalid content format" };
  }

  const validated = resumeContentSchema.safeParse(parsedContent);
  if (!validated.success) {
    return { success: false, error: "Invalid content structure" };
  }

  try {
    await updateResumeVersion(user.id, id, { content: validated.data });
    revalidatePath(`${RESUMES_PATH}/${resumeId}`);
    return { success: true, message: "Resume content saved" };
  } catch {
    return { success: false, error: "Failed to save content" };
  }
}
