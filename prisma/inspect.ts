import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const all = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  for (const p of all) {
    console.log(`\n[${p.id}] ${p.titleEn}`);
    console.log(`  cover : ${p.coverImage}`);
    console.log(`  images: ${JSON.stringify(p.images)}`);
    console.log(`  created: ${p.createdAt.toISOString()}`);
  }
}
main().then(() => prisma.$disconnect());
