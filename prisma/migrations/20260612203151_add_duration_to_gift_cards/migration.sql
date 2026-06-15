/*
  Warnings:

  - Added the required column `durationMonths` to the `GiftCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GiftCard" ADD COLUMN     "durationMonths" INTEGER NOT NULL;
