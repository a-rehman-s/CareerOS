import { db } from "@/lib/db";
import type { CertificationInput } from "@/validators/profile";

export async function getCertifications(userId: string) {
  return db.certification.findMany({ where: { userId }, orderBy: { order: "asc" } });
}

export async function createCertification(userId: string, data: CertificationInput) {
  const count = await db.certification.count({ where: { userId } });
  return db.certification.create({ data: { ...data, userId, order: data.order ?? count, credentialUrl: data.credentialUrl || null } });
}

export async function updateCertification(userId: string, id: string, data: Partial<CertificationInput>) {
  const existing = await db.certification.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.certification.update({ where: { id }, data: { ...data, credentialUrl: data.credentialUrl || null } });
}

export async function deleteCertification(userId: string, id: string) {
  const existing = await db.certification.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.certification.delete({ where: { id } });
}
