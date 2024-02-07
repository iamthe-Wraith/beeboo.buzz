/*
  Warnings:

  - The values [PROJECTS] on the enum `ContextRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContextRole_new" AS ENUM ('NONE', 'INBOX', 'WAITING');
ALTER TABLE "Context" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Context" ALTER COLUMN "role" TYPE "ContextRole_new" USING ("role"::text::"ContextRole_new");
ALTER TYPE "ContextRole" RENAME TO "ContextRole_old";
ALTER TYPE "ContextRole_new" RENAME TO "ContextRole";
DROP TYPE "ContextRole_old";
ALTER TABLE "Context" ALTER COLUMN "role" SET DEFAULT 'NONE';
COMMIT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "project_id" INTEGER,
ADD COLUMN     "project_order" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "due_date" TIMESTAMP(6),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
