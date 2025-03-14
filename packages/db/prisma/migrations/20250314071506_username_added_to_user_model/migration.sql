-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providers" "Providers" NOT NULL DEFAULT 'CREDENTIALS';
