-- Suppression de l'ancien lien Reservation -> Table (table figée à la création).
--
-- Depuis le modèle « réservation par service », la table n'est plus figée : elle est
-- recalculée à la demande, et seules les réservations épinglées (pinnedTableIds) gardent
-- des tables imposées. Plus aucun code ne lit ni n'écrit cette colonne.
--
-- ATTENTION : irréversible pour les données. Les anciennes affectations de tables
-- (Reservation.tableId) sont perdues ; elles n'avaient plus d'effet sur la disponibilité.

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_tableId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "tableId";
