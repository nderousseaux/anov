/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `ProductOrder` table. All the data in the column will be lost.
  - The `deliveryMethod` column on the `ProductOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ProductOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'READY', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "GiftCard" ADD COLUMN     "reminderEmailSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductOrder" DROP COLUMN "expiresAt",
DROP COLUMN "deliveryMethod",
ADD COLUMN     "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'PICKUP',
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "RestaurantSettings" ALTER COLUMN "daysBeforeReminder" SET DEFAULT 3;
