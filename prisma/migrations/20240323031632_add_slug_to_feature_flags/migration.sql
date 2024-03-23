/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `FeatureFlag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `FeatureFlag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeatureFlag" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_slug_key" ON "FeatureFlag"("slug");
