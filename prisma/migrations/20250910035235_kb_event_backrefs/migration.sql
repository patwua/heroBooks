-- Adjust foreign keys and indexes for KbEvent

-- Drop old foreign keys if they exist
ALTER TABLE "KbEvent" DROP CONSTRAINT IF EXISTS "KbEvent_userId_fkey";
ALTER TABLE "KbEvent" DROP CONSTRAINT IF EXISTS "KbEvent_orgId_fkey";

-- Re-create foreign keys with on delete/update actions
ALTER TABLE "KbEvent"
  ADD CONSTRAINT "KbEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "KbEvent"
  ADD CONSTRAINT "KbEvent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop old composite indexes
DROP INDEX IF EXISTS "KbEvent_userId_createdAt_idx";
DROP INDEX IF EXISTS "KbEvent_orgId_createdAt_idx";

-- Create new indexes on relation scalar fields
CREATE INDEX "KbEvent_userId_idx" ON "KbEvent"("userId");
CREATE INDEX "KbEvent_orgId_idx" ON "KbEvent"("orgId");

-- Ensure slug and createdAt composite index remains
CREATE INDEX IF NOT EXISTS "KbEvent_slug_createdAt_idx" ON "KbEvent"("slug", "createdAt");
