-- CreateEnum
CREATE TYPE "ReservationSource" AS ENUM ('WEB', 'PHONE', 'WALK_IN');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "pinnedTableIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "source" "ReservationSource" NOT NULL DEFAULT 'WEB',
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "walkIn" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TableCombo" (
    "id" SERIAL NOT NULL,
    "tableIds" INTEGER[],
    "capacityOverride" INTEGER,

    CONSTRAINT "TableCombo_pkey" PRIMARY KEY ("id")
);

