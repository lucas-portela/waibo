/*
  Warnings:

  - Changed the type of `sender` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ChatSender" AS ENUM ('USER', 'BOT', 'RECIPIENT');

-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "sender",
ADD COLUMN     "sender" "public"."ChatSender" NOT NULL;

-- DropEnum
DROP TYPE "public"."ChatMessageSender";
