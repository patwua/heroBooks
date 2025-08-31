-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "wht" DECIMAL(10,2),
    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillLine" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(10,2) NOT NULL,
    "taxCodeId" TEXT,
    CONSTRAINT "BillLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_id_orgId_key" ON "Vendor"("id", "orgId");
CREATE UNIQUE INDEX "Bill_id_orgId_key" ON "Bill"("id", "orgId");
CREATE UNIQUE INDEX "BillLine_id_orgId_key" ON "BillLine"("id", "orgId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vendorId_orgId_fkey" FOREIGN KEY ("vendorId", "orgId") REFERENCES "Vendor"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_billId_orgId_fkey" FOREIGN KEY ("billId", "orgId") REFERENCES "Bill"("id", "orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BillLine" ADD CONSTRAINT "BillLine_taxCodeId_orgId_fkey" FOREIGN KEY ("taxCodeId", "orgId") REFERENCES "TaxCode"("id", "orgId") ON DELETE SET NULL ON UPDATE CASCADE;
