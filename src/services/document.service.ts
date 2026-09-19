import { db } from "@/lib/db";
import type { DocumentInput } from "@/validators/resume";

export async function getDocuments(userId: string) {
  return db.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDocument(userId: string, data: DocumentInput) {
  return db.document.create({
    data: { ...data, userId },
  });
}

export async function deleteDocument(userId: string, id: string) {
  const existing = await db.document.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Not found");
  return db.document.delete({ where: { id } });
}

export async function getDocumentsByType(userId: string, documentType: string) {
  return db.document.findMany({
    where: { userId, documentType },
    orderBy: { createdAt: "desc" },
  });
}
