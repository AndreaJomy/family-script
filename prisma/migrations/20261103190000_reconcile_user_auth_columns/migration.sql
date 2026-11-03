DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'UserRole'
  ) THEN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'UserStatus'
  ) THEN
    CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
  END IF;
END
$$;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "username" TEXT,
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'USER',
  ADD COLUMN IF NOT EXISTS "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX IF NOT EXISTS "users_status_idx" ON "users"("status");

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'accounts' AND column_name = 'provider'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'accounts' AND column_name = 'providerId'
  ) THEN
    ALTER TABLE "accounts" RENAME COLUMN "provider" TO "providerId";
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'accounts' AND column_name = 'providerAccountId'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'accounts' AND column_name = 'accountId'
  ) THEN
    ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "accountId";
  END IF;
END
$$;

DROP INDEX IF EXISTS "accounts_provider_providerAccountId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "accounts_providerId_accountId_key"
  ON "accounts"("providerId", "accountId");
