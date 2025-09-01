-- Alter Payment to include method and receiptNumber
ALTER TABLE "Payment" ADD COLUMN "method" TEXT NOT NULL;
ALTER TABLE "Payment" ADD COLUMN "receiptNumber" INTEGER NOT NULL;
