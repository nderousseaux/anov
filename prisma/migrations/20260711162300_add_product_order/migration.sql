-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'READY', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateModel
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

-- CreateModel
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
CREATE UNIQUE INDEX "ProductOrder_code_key" ON "ProductOrder"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOrder_stripeSessionId_key" ON "ProductOrder"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAddress_orderId_key" ON "ProductAddress"("orderId");

-- AddForeignKey
ALTER TABLE "ProductAddress" ADD CONSTRAINT "ProductAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;