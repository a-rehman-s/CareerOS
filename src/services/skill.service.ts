import { db } from "@/lib/db";
import type { SkillInput } from "@/validators/profile";

export async function getSkills(userId: string) {
  return db.skill.findMany({
    where: { userId },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
}

/** Group skills by category for display */
export function groupSkillsByCategory<T extends { category: string | null }>(skills: T[]) {
  return skills.reduce<Record<string, T[]>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

export async function createSkill(userId: string, data: SkillInput) {
  const count = await db.skill.count({ where: { userId } });
  return db.skill.create({
    data: { ...data, userId, order: data.order ?? count },
  });
}

export async function updateSkill(userId: string, id: string, data: Partial<SkillInput>) {
  const existing = await db.skill.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.skill.update({ where: { id }, data });
}

export async function deleteSkill(userId: string, id: string) {
  const existing = await db.skill.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.skill.delete({ where: { id } });
}
