-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('completed', 'in_progress', 'archived');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "titleHe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionHe" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "shortDescriptionHe" TEXT NOT NULL,
    "shortDescriptionEn" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT,
    "year" INTEGER,
    "status" "ProjectStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_visible_sort_order_idx" ON "Project"("visible", "sort_order");
