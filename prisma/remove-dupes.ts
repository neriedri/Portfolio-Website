import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const DUPES = ["sqlconfig", "fincoreai", "embytrial", "ardani", "zfb"];
async function main() {
  const r = await prisma.project.deleteMany({ where: { id: { in: DUPES } } });
  console.log(`deleted ${r.count} duplicate (SVG) projects`);
  const all = await prisma.project.findMany({
    select: { id: true, titleEn: true, coverImage: true, visible: true },
    orderBy: { order: "asc" },
  });
  console.log(`\nremaining (${all.length}):`);
  for (const p of all)
    console.log(`${p.visible ? "✓" : "·"} ${p.id} — ${p.titleEn}  [${p.coverImage}]`);
}
main().then(() => prisma.$disconnect());
