/*
  Warnings:

  - A unique constraint covering the columns `[orgId,name]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "qtyOnHand" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_orgId_name_key" ON "Vendor"("orgId", "name");
