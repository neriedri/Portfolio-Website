import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const r = await prisma.project.updateMany({ data: { visible: true } });
  console.log(`restored visible=true on ${r.count} projects`);
  const all = await prisma.project.findMany({
    select: { id: true, titleEn: true, visible: true },
    orderBy: { order: "asc" },
  });
  for (const p of all) console.log(`${p.visible ? "✓" : "·"} ${p.id} — ${p.titleEn}`);
}

main().then(() => prisma.$disconnect());
