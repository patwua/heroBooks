-- Drop legacy single-column foreign keys
ALTER TABLE "Bill" DROP CONSTRAINT IF EXISTS "Bill_vendorId_fkey";
ALTER TABLE "BillLine" DROP CONSTRAINT IF EXISTS "BillLine_billId_fkey";
ALTER TABLE "BillLine" DROP CONSTRAINT IF EXISTS "BillLine_taxCodeId_fkey";

-- Add composite foreign keys
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_orgId_fkey" FOREIGN KEY ("vendorId", "orgId") REFERENCES "Vendor"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes for the new composite keys
CREATE INDEX IF NOT EXISTS "Bill_vendorId_orgId_idx" ON "Bill"("vendorId", "orgId");
CREATE INDEX IF NOT EXISTS "BillLine_billId_orgId_idx" ON "BillLine"("billId", "orgId");
CREATE INDEX IF NOT EXISTS "BillLine_taxCodeId_orgId_idx" ON "BillLine"("taxCodeId", "orgId");
