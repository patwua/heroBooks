-- AlterTable
ALTER TABLE "CheckoutIntent" ADD COLUMN "orgId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CheckoutIntent" ADD CONSTRAINT "CheckoutIntent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "CheckoutIntent_orgId_idx" ON "CheckoutIntent"("orgId");
