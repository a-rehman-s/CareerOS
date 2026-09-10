import { db } from "@/lib/db";
import type { ExperienceInput } from "@/validators/profile";

export async function getExperience(userId: string) {
  return db.experience.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
}

export async function createExperience(userId: string, data: ExperienceInput) {
  const count = await db.experience.count({ where: { userId } });
  return db.experience.create({
    data: { ...data, userId, order: data.order ?? count },
  });
}

export async function updateExperience(userId: string, id: string, data: Partial<ExperienceInput>) {
  const existing = await db.experience.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.experience.update({ where: { id }, data });
}

export async function deleteExperience(userId: string, id: string) {
  const existing = await db.experience.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.experience.delete({ where: { id } });
}
