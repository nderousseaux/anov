import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { config } from "dotenv";

// On charge les variables d'environnement
config({ path: ".env.local" });

function expandEnv(value: string): string {
  return value.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] ?? "");
}

function createPrismaClient() {
  const connectionString = expandEnv(process.env.DATABASE_URL || "");
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment");
  }
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");
  const adapter = isLocal
    ? new PrismaPg({ connectionString })
    : new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter } as any);
}

const prisma = createPrismaClient();

// Jours d'ouverture standards : Mardi (2) à Samedi (6)
const OPENING_DAYS = [2, 3, 4, 5, 6];

/**
 * Retourne le Nième jour ouvert précédent
 */
function getPreviousOpenDay(baseDate: Date, count = 1): Date {
  const d = new Date(baseDate);
  d.setUTCHours(0, 0, 0, 0);
  let found = 0;
  while (found < count) {
    d.setUTCDate(d.getUTCDate() - 1);
    if (OPENING_DAYS.includes(d.getUTCDay())) {
      found++;
    }
  }
  return d;
}

/**
 * Retourne le Nième jour ouvert suivant.
 * Si count === 0 et que baseDate est déjà un jour ouvert, renvoie baseDate.
 */
function getNextOpenDay(baseDate: Date, count = 0): Date {
  const d = new Date(baseDate);
  d.setUTCHours(0, 0, 0, 0);
  if (count === 0 && OPENING_DAYS.includes(d.getUTCDay())) {
    return d;
  }
  let found = 0;
  const target = count === 0 ? 1 : count;
  while (found < target) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (OPENING_DAYS.includes(d.getUTCDay())) {
      found++;
    }
  }
  return d;
}

async function main() {
  console.log("🌱 Début du seed des données de test...");

  const now = new Date();

  // Date d'aujourd'hui à minuit UTC
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);

  const isTodayOpen = OPENING_DAYS.includes(today.getUTCDay());

  // Calcul des autres jours d'ouverture relatifs
  const yesterdayOpen = getPreviousOpenDay(today, 1);
  const tomorrowOpen = getNextOpenDay(today, 1);
  const nextWeekOpen = getNextOpenDay(today, 4);

  // Jours réservés pour les DayOverrides (pas de réservations dessus)
  const futureClosedDay = getNextOpenDay(today, 10);
  const customHoursDay = getNextOpenDay(today, 8);

  // 1. Restaurant Settings
  console.log("⚙️ Upsert RestaurantSettings...");
  await prisma.restaurantSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      maxCovers: 20,
      mealDuration: 90,
      openingDays: JSON.stringify(OPENING_DAYS), // [2,3,4,5,6]
      openingSlots: JSON.stringify([
        "12:00", "12:30", "13:00", "13:30",
        "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
      ]),
      depositPerGuestCents: 2000,
      daysBeforeReminder: 1,
    },
  });

  // 2. Tables
  console.log("🪑 Upsert des Tables de T1 à T6...");
  const tablesData = [
    { id: 1, name: "T1", capacity: 2, posX: 20, posY: 85 },
    { id: 2, name: "T2", capacity: 2, posX: 80, posY: 85 },
    { id: 3, name: "T3", capacity: 3, posX: 20, posY: 50 },
    { id: 4, name: "T4", capacity: 3, posX: 80, posY: 50 },
    { id: 5, name: "T5", capacity: 4, posX: 20, posY: 15 },
    { id: 6, name: "T6", capacity: 4, posX: 80, posY: 15 },
  ];

  for (const table of tablesData) {
    await prisma.table.upsert({
      where: { id: table.id },
      update: {
        name: table.name,
        capacity: table.capacity,
        posX: table.posX,
        posY: table.posY,
      },
      create: table,
    });
  }

  // Nettoyage des anciennes données de seed
  console.log("🧹 Nettoyage des anciennes données de seed...");

  await prisma.productAddress.deleteMany({
    where: { orderId: { startsWith: "seed-po-" } }
  });

  await prisma.reservation.deleteMany({
    where: { id: { startsWith: "seed-res-" } }
  });

  await prisma.giftCard.deleteMany({
    where: { id: { startsWith: "seed-gc-" } }
  });

  await prisma.gourmetOffer.deleteMany({
    where: { id: { startsWith: "seed-go-" } }
  });

  await prisma.productOrder.deleteMany({
    where: { id: { startsWith: "seed-po-" } }
  });

  await prisma.contactMessage.deleteMany({
    where: { id: { startsWith: "seed-cm-" } }
  });

  await prisma.customerNote.deleteMany({
    where: { email: { in: ["jean.dupont@example.com", "sophie.martin@example.com"] } }
  });

  await prisma.dayOverride.deleteMany({
    where: { date: { in: [today, futureClosedDay, customHoursDay] } }
  });

  // Si aujourd'hui est un jour normalement fermé (ex: dimanche ou lundi), on force son ouverture par un DayOverride
  if (!isTodayOpen) {
    console.log("🔓 Ajout d'un DayOverride pour forcer l'ouverture d'aujourd'hui (afin de voir les résas par défaut)...");
    await prisma.dayOverride.create({
      data: {
        date: today,
        closed: false,
        maxCovers: 20,
        openingSlots: JSON.stringify([
          "12:00", "12:30", "13:00", "13:30",
          "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
        ]),
      }
    });
  }

  // 3. Réservations de test (dont plusieurs aujourd'hui pour l'affichage par défaut dans l'admin)
  console.log("📅 Création des Réservations...");

  const reservations = [
    {
      id: "seed-res-1",
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      phone: "+33612345678",
      date: (() => {
        const d = new Date(yesterdayOpen);
        d.setUTCHours(12, 30, 0, 0);
        return d;
      })(),
      guests: 2,
      specialRequest: "Allergie au gluten",
      status: "COMPLETED" as const,
      depositPaidCents: 4000,
      tableId: 1, // T1
      cancelToken: "seed-token-1",
    },
    {
      id: "seed-res-2",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      phone: "+33698765432",
      date: (() => {
        const d = new Date(today);
        d.setUTCHours(12, 30, 0, 0);
        return d;
      })(),
      guests: 2,
      specialRequest: "Près de la fenêtre si possible",
      status: "CONFIRMED" as const,
      depositPaidCents: 4000,
      tableId: 2, // T2
      cancelToken: "seed-token-2",
    },
    {
      id: "seed-res-3",
      name: "Michel Durand",
      email: "michel.durand@example.com",
      phone: "+33611223344",
      date: (() => {
        const d = new Date(today);
        d.setUTCHours(20, 0, 0, 0);
        return d;
      })(),
      guests: 4,
      status: "CONFIRMED" as const,
      depositPaidCents: 8000,
      tableId: 5, // T5
      cancelToken: "seed-token-3",
    },
    {
      id: "seed-res-4",
      name: "Alice Bernard",
      email: "alice.bernard@example.com",
      phone: "+33655443322",
      date: (() => {
        const d = new Date(tomorrowOpen);
        d.setUTCHours(12, 0, 0, 0);
        return d;
      })(),
      guests: 2,
      status: "CONFIRMED" as const,
      depositPaidCents: 4000,
      tableId: 2, // T2
      cancelToken: "seed-token-4",
    },
    {
      id: "seed-res-5",
      name: "Pierre Petit",
      email: "pierre.petit@example.com",
      date: (() => {
        const d = new Date(tomorrowOpen);
        d.setUTCHours(19, 0, 0, 0);
        return d;
      })(),
      guests: 2,
      status: "PENDING_PAYMENT" as const,
      depositPaidCents: 4000,
      transactionExpireAt: new Date(now.getTime() + 10 * 60 * 1000), // Expiration dans 10 minutes
      tableId: 1, // T1
      cancelToken: "seed-token-5",
    },
    {
      id: "seed-res-6",
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      date: (() => {
        const d = new Date(nextWeekOpen);
        d.setUTCHours(20, 30, 0, 0);
        return d;
      })(),
      guests: 4,
      status: "CONFIRMED" as const,
      depositPaidCents: 8000,
      tableId: 6, // T6
      cancelToken: "seed-token-6",
    },
    {
      id: "seed-res-7",
      name: "Lucas Roux",
      email: "lucas.roux@example.com",
      date: (() => {
        const d = new Date(today);
        d.setUTCHours(13, 30, 0, 0);
        return d;
      })(),
      guests: 2,
      status: "CANCELLED" as const,
      depositPaidCents: 4000,
      tableId: 1,
      cancelToken: "seed-token-7",
    }
  ];

  for (const res of reservations) {
    await prisma.reservation.create({
      data: res
    });
  }

  // 4. Day Overrides (autres exceptions futures)
  console.log("📆 Création des exceptions d'horaires...");

  // Fermeture exceptionnelle
  await prisma.dayOverride.create({
    data: {
      date: futureClosedDay,
      closed: true,
      maxCovers: 0,
    }
  });

  // Horaires modifiés (service midi seulement)
  await prisma.dayOverride.create({
    data: {
      date: customHoursDay,
      closed: false,
      maxCovers: 10,
      openingSlots: JSON.stringify(["12:00", "12:30", "13:00"]),
    }
  });

  // 5. Chèques cadeaux de test (Gift Cards)
  console.log("🎁 Création des Chèques Cadeaux...");

  const expiryGiftCard = new Date(now);
  expiryGiftCard.setFullYear(expiryGiftCard.getFullYear() + 1);

  await prisma.giftCard.create({
    data: {
      id: "seed-gc-1",
      code: "ANOV-G-SEED-ACT1",
      amount: 50.0,
      name: "Cadeau de Noël",
      recipientEmail: "client.gift1@example.com",
      personalMessage: "Joyeux Noël à toute la famille !",
      isPaid: true,
      status: "ACTIVE",
      expiresAt: expiryGiftCard,
    }
  });

  await prisma.giftCard.create({
    data: {
      id: "seed-gc-2",
      code: "ANOV-G-SEED-USD2",
      amount: 100.0,
      name: "Anniversaire Papa",
      recipientEmail: "client.gift2@example.com",
      isPaid: true,
      status: "USED",
      expiresAt: expiryGiftCard,
      usedAt: yesterdayOpen,
    }
  });

  await prisma.giftCard.create({
    data: {
      id: "seed-gc-3",
      code: "ANOV-G-SEED-EXP3",
      amount: 30.0,
      name: "Fête des Mères",
      recipientEmail: "client.gift3@example.com",
      isPaid: true,
      status: "EXPIRED",
      expiresAt: yesterdayOpen,
    }
  });

  // 6. Offres gourmandes de test (Gourmet Offers)
  console.log("🍽️ Création des Offres Gourmandes...");

  await prisma.gourmetOffer.create({
    data: {
      id: "seed-go-1",
      code: "ANOV-O-SEED-ACT1",
      offerName: "Menu Découverte pour 2",
      offerDescription: "Un accord mets & vins d'exception",
      price: 178.0,
      name: "Félicitations !",
      recipientEmail: "gourmet.rec1@example.com",
      isPaid: true,
      status: "ACTIVE",
      expiresAt: expiryGiftCard,
    }
  });

  await prisma.gourmetOffer.create({
    data: {
      id: "seed-go-2",
      code: "ANOV-O-SEED-USD2",
      offerName: "Formule Gastronomique",
      offerDescription: "Entrée, plat et dessert au choix",
      price: 89.0,
      name: "Cadeau de départ",
      recipientEmail: "gourmet.rec2@example.com",
      isPaid: true,
      status: "USED",
      expiresAt: expiryGiftCard,
      usedAt: yesterdayOpen,
    }
  });

  // 7. Commandes boutique de test (Product Orders & Addresses)
  console.log("🛒 Création des Commandes Boutique...");

  // Commande 1 : Livraison
  const order1 = await prisma.productOrder.create({
    data: {
      id: "seed-po-1",
      code: "ANOV-P-SEED-SHP1",
      productName: "Coffret Café Gourmand",
      quantity: 1,
      totalPrice: 45.0,
      deliveryMethod: "DELIVERY",
      customerName: "Marc Vanhoutte",
      customerEmail: "marc.vanhoutte@example.com",
      customerPhone: "+33622334455",
      status: "SHIPPED",
    }
  });

  await prisma.productAddress.create({
    data: {
      orderId: order1.id,
      firstName: "Marc",
      lastName: "Vanhoutte",
      address: "45 Rue des Fleurs",
      city: "Lille",
      zipCode: "59000",
      country: "France",
      phone: "+33622334455",
    }
  });

  // Commande 2 : Retrait sur place (PICKUP)
  await prisma.productOrder.create({
    data: {
      id: "seed-po-2",
      code: "ANOV-P-SEED-RDY2",
      productName: "Boîte de 6 Macarons",
      quantity: 2,
      totalPrice: 50.0,
      deliveryMethod: "PICKUP",
      customerName: "Camille Lemaire",
      customerEmail: "camille.lemaire@example.com",
      customerPhone: "+33677889900",
      status: "READY",
    }
  });

  // Commande 3 : Payement en cours expirant bientôt
  await prisma.productOrder.create({
    data: {
      id: "seed-po-3",
      code: "ANOV-P-SEED-PEN3",
      productName: "Sélection de Thés Rares",
      quantity: 1,
      totalPrice: 35.0,
      deliveryMethod: "DELIVERY",
      customerName: "Antoine Dubois",
      customerEmail: "antoine.dubois@example.com",
      customerPhone: "+33655667788",
      status: "PENDING_PAYMENT",
      transactionExpireAt: new Date(now.getTime() + 10 * 60 * 1000),
    }
  });

  // 8. Messages de contact (Contact Messages)
  console.log("💬 Création des Messages de Contact...");

  await prisma.contactMessage.create({
    data: {
      id: "seed-cm-1",
      name: "Paul Lefevre",
      email: "paul.lefevre@example.com",
      subject: "Réservation de groupe",
      message: "Bonjour, j'aimerais réserver pour un groupe de 15 personnes le mois prochain. Est-ce possible de privatiser une partie de la salle ? Merci d'avance.",
      createdAt: yesterdayOpen,
    }
  });

  await prisma.contactMessage.create({
    data: {
      id: "seed-cm-2",
      name: "Julie Moreau",
      email: "julie.moreau@example.com",
      subject: "Question sur les allergènes",
      message: "Bonjour, proposez-vous des options végétaliennes et sans fruits à coque sur votre carte de la semaine ? Cordialement.",
      createdAt: now,
    }
  });

  // 9. Notes clients (Customer Notes)
  console.log("📝 Création des Notes Clients...");

  await prisma.customerNote.create({
    data: {
      email: "jean.dupont@example.com",
      content: "Client régulier, préfère l'eau plate à l'eau gazeuse. Très poli.",
    }
  });

  await prisma.customerNote.create({
    data: {
      email: "sophie.martin@example.com",
      content: "Aime la table T3 près de la fenêtre. Ne boit pas d'alcool.",
    }
  });

  console.log("✨ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de l'exécution du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
