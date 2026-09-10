import { db } from "@/lib/db";
import type { EducationInput } from "@/validators/profile";

export async function getEducation(userId: string) {
  return db.education.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
}

export async function createEducation(userId: string, data: EducationInput) {
  const count = await db.education.count({ where: { userId } });
  return db.education.create({
    data: { ...data, userId, order: data.order ?? count },
  });
}

export async function updateEducation(userId: string, id: string, data: Partial<EducationInput>) {
  // Verify ownership before update
  const existing = await db.education.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.education.update({ where: { id }, data });
}

export async function deleteEducation(userId: string, id: string) {
  const existing = await db.education.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.education.delete({ where: { id } });
}
