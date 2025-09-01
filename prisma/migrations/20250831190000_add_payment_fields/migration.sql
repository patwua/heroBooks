-- Alter Payment to include method and receiptNumber
-- Add as nullable to avoid issues with existing rows
ALTER TABLE "Payment" ADD COLUMN "method" TEXT;
ALTER TABLE "Payment" ADD COLUMN "receiptNumber" INTEGER;

-- Populate existing rows with sensible defaults
UPDATE "Payment" SET "method" = 'cash' WHERE "method" IS NULL;
UPDATE "Payment" SET "receiptNumber" = 1 WHERE "receiptNumber" IS NULL;

-- Ensure columns are required for future records
ALTER TABLE "Payment" ALTER COLUMN "method" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "receiptNumber" SET NOT NULL;
