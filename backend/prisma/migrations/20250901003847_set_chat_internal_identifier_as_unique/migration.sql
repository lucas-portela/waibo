/*
  Warnings:

  - A unique constraint covering the columns `[internalIdentifier]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionId]` on the table `MessageChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_internalIdentifier_key" ON "public"."Chat"("internalIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "MessageChannel_sessionId_key" ON "public"."MessageChannel"("sessionId");
