import { prisma } from "../../src/database";

export async function clearRecommendationsTable() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
