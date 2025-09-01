/*
  Warnings:

  - The values [CONNECTED,ONLINE,OFFLINE] on the enum `MessageChannelStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."MessageChannelStatus_new" AS ENUM ('DISCONNECTED', 'OPEN', 'CONNECTING', 'CLOSE');
ALTER TABLE "public"."MessageChannel" ALTER COLUMN "status" TYPE "public"."MessageChannelStatus_new" USING ("status"::text::"public"."MessageChannelStatus_new");
ALTER TYPE "public"."MessageChannelStatus" RENAME TO "MessageChannelStatus_old";
ALTER TYPE "public"."MessageChannelStatus_new" RENAME TO "MessageChannelStatus";
DROP TYPE "public"."MessageChannelStatus_old";
COMMIT;
