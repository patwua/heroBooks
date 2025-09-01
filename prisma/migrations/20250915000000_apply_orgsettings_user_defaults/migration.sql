-- Ensure extension for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Alter OrgSettings.id to use gen_random_uuid and enforce NOT NULL
ALTER TABLE "OrgSettings"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "id" SET NOT NULL;

-- Set default value for User.updatedAt
ALTER TABLE "User"
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
