-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'IN_PROGRESS_PAYMENT', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('IN_PROGRESS_PAYMENT', 'ACTIVE', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'READY', 'COMPLETED', 'CANCELLED', 'EXPIRED');

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
    "transactionExpireAt" TIMESTAMP(3),
    "depositPaidCents" INTEGER,
    "tableId" INTEGER,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "posX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "posY" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
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
    "daysBeforeReminder" INTEGER NOT NULL DEFAULT 1,

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
    "reminderEmailSent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerNote" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'PICKUP',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "expiresAt" TIMESTAMP(3),
    "transactionExpireAt" TIMESTAMP(3),

    CONSTRAINT "ProductOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAddress" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "phone" TEXT NOT NULL,

    CONSTRAINT "ProductAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_stripeSessionId_key" ON "Reservation"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_cancelToken_key" ON "Reservation"("cancelToken");

-- CreateIndex
CREATE UNIQUE INDEX "Table_name_key" ON "Table"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DayOverride_date_key" ON "DayOverride"("date");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_stripeSessionId_key" ON "GiftCard"("stripeSessionId");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "ContactMessage"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerNote_email_key" ON "CustomerNote"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_code_key" ON "ProductOrder"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_stripeSessionId_key" ON "ProductOrder"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAddress_orderId_key" ON "ProductAddress"("orderId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAddress" ADD CONSTRAINT "ProductAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
