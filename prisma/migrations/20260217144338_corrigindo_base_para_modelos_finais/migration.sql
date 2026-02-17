-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateTable
CREATE TABLE "waba" (
    "id" SERIAL NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "displayPhoneNumber" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "waba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "startDateConversation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDateConversation" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "leadGoal" TEXT,
    "wabaId" INTEGER NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mensagem" TEXT,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rdstation" (
    "id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "Rdstation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "waba_phoneNumberId_key" ON "waba"("phoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "waba_displayPhoneNumber_key" ON "waba"("displayPhoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "contact_phone_key" ON "contact"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Rdstation_refresh_token_key" ON "Rdstation"("refresh_token");

-- AddForeignKey
ALTER TABLE "waba" ADD CONSTRAINT "waba_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waba" ADD CONSTRAINT "waba_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_wabaId_fkey" FOREIGN KEY ("wabaId") REFERENCES "waba"("id") ON DELETE CASCADE ON UPDATE CASCADE;
