-- Add UI settings fields to OrgSettings for site/global configuration
ALTER TABLE "OrgSettings" ADD COLUMN IF NOT EXISTS "scope" TEXT;
ALTER TABLE "OrgSettings" ADD COLUMN IF NOT EXISTS "theme" TEXT;
-- Non-null array column with default empty array for existing rows
ALTER TABLE "OrgSettings" ADD COLUMN IF NOT EXISTS "modules" TEXT[] NOT NULL DEFAULT '{}';

