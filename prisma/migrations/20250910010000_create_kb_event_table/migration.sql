-- Create KbEvent table if missing (for production DBs that skipped dev push)
CREATE TABLE IF NOT EXISTS "KbEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "orgId" TEXT,
  "slug" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KbEvent_pkey" PRIMARY KEY ("id")
);

-- Keep composite index used by queries
CREATE INDEX IF NOT EXISTS "KbEvent_slug_createdAt_idx" ON "KbEvent"("slug", "createdAt");
