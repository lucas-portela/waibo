/*
  Warnings:

  - Added the required column `internalIdentifier` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "internalIdentifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."MessageChannel" ALTER COLUMN "status" DROP DEFAULT;
