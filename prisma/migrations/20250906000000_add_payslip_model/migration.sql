-- CreateTable Payslip
CREATE TABLE "Payslip" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeEmail" TEXT,
    "gross" DECIMAL(14,2) NOT NULL,
    "allowance" DECIMAL(14,2) NOT NULL,
    "chargeable" DECIMAL(14,2) NOT NULL,
    "payeTax" DECIMAL(14,2) NOT NULL,
    "nisEmployee" DECIMAL(14,2) NOT NULL,
    "nisEmployer" DECIMAL(14,2) NOT NULL,
    "nisInsurable" DECIMAL(14,2) NOT NULL,
    "net" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_id_orgId_key" ON "Payslip"("id", "orgId");
CREATE INDEX "Payslip_orgId_period_idx" ON "Payslip"("orgId", "period");
