import { db } from "@/lib/db";
import type { AchievementInput } from "@/validators/profile";

export async function getAchievements(userId: string) {
  return db.achievement.findMany({ where: { userId }, orderBy: { order: "asc" } });
}

export async function createAchievement(userId: string, data: AchievementInput) {
  const count = await db.achievement.count({ where: { userId } });
  return db.achievement.create({ data: { ...data, userId, order: data.order ?? count, url: data.url || null } });
}

export async function updateAchievement(userId: string, id: string, data: Partial<AchievementInput>) {
  const existing = await db.achievement.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.achievement.update({ where: { id }, data: { ...data, url: data.url || null } });
}

export async function deleteAchievement(userId: string, id: string) {
  const existing = await db.achievement.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.achievement.delete({ where: { id } });
}
