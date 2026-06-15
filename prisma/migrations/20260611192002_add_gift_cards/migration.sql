-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "personalMessage" TEXT,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_stripeSessionId_key" ON "GiftCard"("stripeSessionId");
