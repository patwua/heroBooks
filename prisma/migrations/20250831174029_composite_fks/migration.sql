/*
  Warnings:

  - The primary key for the `OrgSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency` on the `OrgSettings` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `OrgSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,orgId]` on the table `BankTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `Estimate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orgId,number]` on the table `Estimate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `EstimateLine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orgId,number]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `InvoiceLine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orgId]` on the table `OrgSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orgId]` on the table `TaxCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgId` to the `EstimateLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `InvoiceLine` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `OrgSettings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `orgId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `UserOrg` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'AGENT', 'VIEWER');

-- Ensure UUID generation extension is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "BankTransaction" DROP CONSTRAINT "BankTransaction_billId_fkey";

-- DropForeignKey
ALTER TABLE "BankTransaction" DROP CONSTRAINT "BankTransaction_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "BankTransaction" DROP CONSTRAINT "BankTransaction_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "BillLine" DROP CONSTRAINT "BillLine_billId_fkey";

-- DropForeignKey
ALTER TABLE "BillLine" DROP CONSTRAINT "BillLine_taxCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Estimate" DROP CONSTRAINT "Estimate_customerId_fkey";

-- DropForeignKey
ALTER TABLE "EstimateLine" DROP CONSTRAINT "EstimateLine_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "EstimateLine" DROP CONSTRAINT "EstimateLine_taxCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceLine" DROP CONSTRAINT "InvoiceLine_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceLine" DROP CONSTRAINT "InvoiceLine_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InvoiceLine" DROP CONSTRAINT "InvoiceLine_taxCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_taxCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropIndex
DROP INDEX "Estimate_number_key";

-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "EstimateLine" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceLine" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'GY';

-- AlterTable
ALTER TABLE "OrgSettings" DROP CONSTRAINT "OrgSettings_pkey",
DROP COLUMN "currency",
DROP COLUMN "timezone",
ADD COLUMN     "allowNegativeStock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "brandHex" TEXT,
ADD COLUMN     "id" TEXT;

UPDATE "OrgSettings" SET "id" = gen_random_uuid()::text;

ALTER TABLE "OrgSettings" ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "OrgSettings" ADD CONSTRAINT "OrgSettings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

UPDATE "User" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserOrg" ADD COLUMN "role_new" "Role";

UPDATE "UserOrg" SET "role_new" = "role"::"Role";

ALTER TABLE "UserOrg" DROP COLUMN "role";

ALTER TABLE "UserOrg" RENAME COLUMN "role_new" TO "role";

ALTER TABLE "UserOrg" ALTER COLUMN "role" SET NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token");

-- CreateTable
CREATE TABLE "InboundMailbox" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InboundMailbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailIngestLog" (
    "id" TEXT NOT NULL,
    "mailboxId" TEXT,
    "vendor" TEXT,
    "billId" TEXT,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailIngestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InboundMailbox_email_key" ON "InboundMailbox"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransaction_id_orgId_key" ON "BankTransaction"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_orgId_key" ON "Customer"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Estimate_id_orgId_key" ON "Estimate"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Estimate_orgId_number_key" ON "Estimate"("orgId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "EstimateLine_id_orgId_key" ON "EstimateLine"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_id_orgId_key" ON "Invoice"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orgId_number_key" ON "Invoice"("orgId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceLine_id_orgId_key" ON "InvoiceLine"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_orgId_key" ON "Item"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgSettings_orgId_key" ON "OrgSettings"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_orgId_key" ON "Payment"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxCode_id_orgId_key" ON "TaxCode"("id", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailIngestLog" ADD CONSTRAINT "EmailIngestLog_mailboxId_fkey" FOREIGN KEY ("mailboxId") REFERENCES "InboundMailbox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_orgId_fkey" FOREIGN KEY ("customerId", "orgId") REFERENCES "Customer"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_invoiceId_orgId_fkey" FOREIGN KEY ("invoiceId", "orgId") REFERENCES "Invoice"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_itemId_orgId_fkey" FOREIGN KEY ("itemId", "orgId") REFERENCES "Item"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_orgId_fkey" FOREIGN KEY ("invoiceId", "orgId") REFERENCES "Invoice"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_orgId_fkey" FOREIGN KEY ("vendorId", "orgId") REFERENCES "Vendor"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_customerId_orgId_fkey" FOREIGN KEY ("customerId", "orgId") REFERENCES "Customer"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLine" ADD CONSTRAINT "EstimateLine_estimateId_orgId_fkey" FOREIGN KEY ("estimateId", "orgId") REFERENCES "Estimate"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimateLine" ADD CONSTRAINT "EstimateLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_invoiceId_orgId_fkey" FOREIGN KEY ("invoiceId", "orgId") REFERENCES "Invoice"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_paymentId_orgId_fkey" FOREIGN KEY ("paymentId", "orgId") REFERENCES "Payment"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
