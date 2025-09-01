-- Drop legacy single-column foreign keys
ALTER TABLE "Bill" DROP CONSTRAINT IF EXISTS "Bill_vendorId_fkey";
ALTER TABLE "BillLine" DROP CONSTRAINT IF EXISTS "BillLine_billId_fkey";
ALTER TABLE "BillLine" DROP CONSTRAINT IF EXISTS "BillLine_taxCodeId_fkey";
ALTER TABLE "BillLine" DROP CONSTRAINT IF EXISTS "BillLine_itemId_fkey";

-- Add missing itemId column for composite relation
ALTER TABLE "BillLine" ADD COLUMN     "itemId" TEXT;

-- Add composite foreign keys
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_orgId_fkey" FOREIGN KEY ("vendorId", "orgId") REFERENCES "Vendor"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_itemId_orgId_fkey" FOREIGN KEY ("itemId", "orgId") REFERENCES "Item"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
