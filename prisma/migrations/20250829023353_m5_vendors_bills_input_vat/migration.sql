-- Adjust existing vendor/bill tables instead of recreating them
-- Ensure UUID generation extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendor table updates
ALTER TABLE "Vendor"
  ADD COLUMN IF NOT EXISTS "orgId" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "Vendor"
  ALTER COLUMN "orgId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Vendor_id_orgId_key" ON "Vendor"("id", "orgId");
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Bill table updates
ALTER TABLE "Bill"
  ADD COLUMN IF NOT EXISTS "orgId" TEXT,
  ADD COLUMN IF NOT EXISTS "vendorId" TEXT,
  ADD COLUMN IF NOT EXISTS "billDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "wht" DECIMAL(10,2);
ALTER TABLE "Bill"
  ALTER COLUMN "orgId" SET NOT NULL,
  ALTER COLUMN "vendorId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Bill_id_orgId_key" ON "Bill"("id", "orgId");
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_orgId_fkey" FOREIGN KEY ("vendorId", "orgId") REFERENCES "Vendor"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- BillLine table updates
ALTER TABLE "BillLine"
  ADD COLUMN IF NOT EXISTS "orgId" TEXT,
  ADD COLUMN IF NOT EXISTS "taxCodeId" TEXT;
ALTER TABLE "BillLine"
  ALTER COLUMN "orgId" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "BillLine_id_orgId_key" ON "BillLine"("id", "orgId");
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE SET NULL ON UPDATE CASCADE;

