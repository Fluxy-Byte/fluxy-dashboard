/*
  Warnings:

  - The primary key for the `Rdstation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `agent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `waba` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "contact" DROP CONSTRAINT "contact_wabaId_fkey";

-- DropForeignKey
ALTER TABLE "waba" DROP CONSTRAINT "waba_agentId_fkey";

-- AlterTable
ALTER TABLE "Rdstation" DROP CONSTRAINT "Rdstation_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Rdstation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "agent" DROP CONSTRAINT "agent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "agent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "agent_id_seq";

-- AlterTable
ALTER TABLE "contact" DROP CONSTRAINT "contact_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "wabaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "contact_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contact_id_seq";

-- AlterTable
ALTER TABLE "waba" DROP CONSTRAINT "waba_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "agentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "waba_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "waba_id_seq";

-- AddForeignKey
ALTER TABLE "waba" ADD CONSTRAINT "waba_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_wabaId_fkey" FOREIGN KEY ("wabaId") REFERENCES "waba"("id") ON DELETE CASCADE ON UPDATE CASCADE;
