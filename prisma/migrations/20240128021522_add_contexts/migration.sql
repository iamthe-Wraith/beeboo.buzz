-- CreateEnum
CREATE TYPE "ContextRole" AS ENUM ('NONE', 'INBOX', 'PROJECTS', 'WAITING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ownerId" INTEGER;

-- CreateTable
CREATE TABLE "Context" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" INTEGER NOT NULL,
    "order" DOUBLE PRECISION NOT NULL,
    "role" "ContextRole" NOT NULL DEFAULT 'NONE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Context" ADD CONSTRAINT "Context_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
