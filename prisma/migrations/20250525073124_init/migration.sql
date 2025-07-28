-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "order" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifyingLinkSentAt" TIMESTAMP(3);
