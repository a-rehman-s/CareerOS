import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { ProjectInput } from "@/validators/profile";

export async function getProjects(userId: string) {
  return db.project.findMany({
    where: { userId },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
}

export async function createProject(userId: string, data: ProjectInput) {
  const count = await db.project.count({ where: { userId } });
  // Ensure slug is unique for this user
  const slug = await ensureUniqueSlug(userId, data.slug || slugify(data.name));
  return db.project.create({
    data: { ...data, slug, userId, order: data.order ?? count },
  });
}

export async function updateProject(userId: string, id: string, data: Partial<ProjectInput>) {
  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.project.update({ where: { id }, data });
}

export async function deleteProject(userId: string, id: string) {
  const existing = await db.project.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.project.delete({ where: { id } });
}

async function ensureUniqueSlug(userId: string, slug: string, attempt = 0): Promise<string> {
  const candidate = attempt === 0 ? slug : `${slug}-${attempt}`;
  const exists = await db.project.findFirst({ where: { userId, slug: candidate } });
  if (!exists) return candidate;
  return ensureUniqueSlug(userId, slug, attempt + 1);
}
