-- CreateEnum
CREATE TYPE "GourmetOfferStatus" AS ENUM ('IN_PROGRESS_PAYMENT', 'ACTIVE', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "GourmetOffer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "offerDescription" TEXT,
    "offerImage" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "recipientEmail" TEXT,
    "personalMessage" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "GourmetOfferStatus" NOT NULL DEFAULT 'IN_PROGRESS_PAYMENT',
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "transactionExpireAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "reminderEmailSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GourmetOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GourmetOffer_code_key" ON "GourmetOffer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GourmetOffer_stripeSessionId_key" ON "GourmetOffer"("stripeSessionId");
