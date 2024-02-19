/*
  Warnings:

  - You are about to drop the column `notes` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "notes",
ADD COLUMN     "description" VARCHAR(3000);
