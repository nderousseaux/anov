/*
  Warnings:

  - You are about to drop the `ProductAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductAddress" DROP CONSTRAINT "ProductAddress_orderId_fkey";

-- AlterTable
ALTER TABLE "GiftCard" ADD COLUMN     "reminderEmailSent" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ProductAddress";

-- DropTable
DROP TABLE "ProductOrder";
