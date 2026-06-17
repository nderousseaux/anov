/*
  Warnings:

  - You are about to drop the column `durationMonths` on the `GiftCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GiftCard" DROP COLUMN "durationMonths",
ALTER COLUMN "recipientEmail" DROP NOT NULL;
