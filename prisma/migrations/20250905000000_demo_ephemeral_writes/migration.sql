-- Add ephemeral demo fields to key tables
ALTER TABLE "Customer"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "Customer_orgId_isDemo_idx" ON "Customer"("orgId","isDemo");
CREATE INDEX "Customer_isDemo_expiresAt_idx" ON "Customer"("isDemo","expiresAt");
CREATE INDEX "Customer_isDemo_demoSessionId_idx" ON "Customer"("isDemo","demoSessionId");

ALTER TABLE "Item"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "Item_orgId_isDemo_idx" ON "Item"("orgId","isDemo");
CREATE INDEX "Item_isDemo_expiresAt_idx" ON "Item"("isDemo","expiresAt");
CREATE INDEX "Item_isDemo_demoSessionId_idx" ON "Item"("isDemo","demoSessionId");

ALTER TABLE "Invoice"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "Invoice_orgId_isDemo_idx" ON "Invoice"("orgId","isDemo");
CREATE INDEX "Invoice_isDemo_expiresAt_idx" ON "Invoice"("isDemo","expiresAt");
CREATE INDEX "Invoice_isDemo_demoSessionId_idx" ON "Invoice"("isDemo","demoSessionId");

ALTER TABLE "Estimate"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "Estimate_orgId_isDemo_idx" ON "Estimate"("orgId","isDemo");
CREATE INDEX "Estimate_isDemo_expiresAt_idx" ON "Estimate"("isDemo","expiresAt");
CREATE INDEX "Estimate_isDemo_demoSessionId_idx" ON "Estimate"("isDemo","demoSessionId");

ALTER TABLE "Payment"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "Payment_orgId_isDemo_idx" ON "Payment"("orgId","isDemo");
CREATE INDEX "Payment_isDemo_expiresAt_idx" ON "Payment"("isDemo","expiresAt");
CREATE INDEX "Payment_isDemo_demoSessionId_idx" ON "Payment"("isDemo","demoSessionId");

ALTER TABLE "BankTransaction"
  ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demoSessionId" TEXT,
  ADD COLUMN "expiresAt" TIMESTAMP;
CREATE INDEX "BankTransaction_orgId_isDemo_idx" ON "BankTransaction"("orgId","isDemo");
CREATE INDEX "BankTransaction_isDemo_expiresAt_idx" ON "BankTransaction"("isDemo","expiresAt");
CREATE INDEX "BankTransaction_isDemo_demoSessionId_idx" ON "BankTransaction"("isDemo","demoSessionId");
