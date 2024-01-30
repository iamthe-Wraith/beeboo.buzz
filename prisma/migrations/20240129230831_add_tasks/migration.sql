/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Context` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `Context` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Context" DROP CONSTRAINT "Context_ownerId_fkey";

-- AlterTable
ALTER TABLE "Context" DROP COLUMN "ownerId",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "due_date" TIMESTAMP(6),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "owner_id" INTEGER NOT NULL,
    "context_id" INTEGER NOT NULL,
    "context_order" DOUBLE PRECISION,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_context_id_fkey" FOREIGN KEY ("context_id") REFERENCES "Context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
