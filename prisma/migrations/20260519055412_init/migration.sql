-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'IN_PROGRESS_PAYMENT', 'EXPIRED');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "specialRequest" TEXT,
    "wantsSmsReminder" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "reminderEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSmsSent" BOOLEAN NOT NULL DEFAULT false,
    "cancelToken" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maxCovers" INTEGER NOT NULL DEFAULT 20,
    "mealDuration" INTEGER NOT NULL DEFAULT 90,
    "openingDays" TEXT NOT NULL DEFAULT '[2,3,4,5,6]',
    "openingSlots" TEXT NOT NULL DEFAULT '["12:00","12:30","13:00","13:30","19:00","19:30","20:00","20:30","21:00","21:30"]',
    "depositPerGuestCents" INTEGER NOT NULL DEFAULT 2000,

    CONSTRAINT "RestaurantSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayOverride" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "maxCovers" INTEGER,
    "openingSlots" TEXT,

    CONSTRAINT "DayOverride_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('IN_PROGRESS_PAYMENT', 'ACTIVE', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "recipientEmail" TEXT,
    "personalMessage" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'IN_PROGRESS_PAYMENT',
    "stripeSessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "transactionExpireAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_stripeSessionId_key" ON "Reservation"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_cancelToken_key" ON "Reservation"("cancelToken");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DayOverride_date_key" ON "DayOverride"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_stripeSessionId_key" ON "GiftCard"("stripeSessionId");
