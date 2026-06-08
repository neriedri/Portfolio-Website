import { PrismaClient } from "@prisma/client";
import { mockProjects } from "../src/lib/mock-data";
import { toDbStatus } from "../src/lib/mappers";

const prisma = new PrismaClient();

async function main() {
  for (const p of mockProjects) {
    const data = {
      id: p.id,
      titleHe: p.title.he,
      titleEn: p.title.en,
      descriptionHe: p.description.he,
      descriptionEn: p.description.en,
      shortDescriptionHe: p.shortDescription.he,
      shortDescriptionEn: p.shortDescription.en,
      coverImage: p.coverImage,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      tags: p.tags,
      featured: p.featured ?? false,
      order: p.order ?? 0,
      visible: p.visible,
      role: p.role ?? null,
      year: p.year ?? null,
      status: p.status ? toDbStatus(p.status) : null,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    };
    // Upsert keeps the seed idempotent across re-runs.
    await prisma.project.upsert({
      where: { id: p.id },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${mockProjects.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
