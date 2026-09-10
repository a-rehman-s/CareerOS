import { db } from "@/lib/db";
import type { ProfessionalLinkInput } from "@/validators/profile";

export async function getLinks(userId: string) {
  return db.professionalLink.findMany({ where: { userId }, orderBy: { order: "asc" } });
}

export async function createLink(userId: string, data: ProfessionalLinkInput) {
  const count = await db.professionalLink.count({ where: { userId } });
  return db.professionalLink.create({ data: { ...data, userId, order: data.order ?? count } });
}

export async function updateLink(userId: string, id: string, data: Partial<ProfessionalLinkInput>) {
  const existing = await db.professionalLink.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.professionalLink.update({ where: { id }, data });
}

export async function deleteLink(userId: string, id: string) {
  const existing = await db.professionalLink.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.professionalLink.delete({ where: { id } });
}
