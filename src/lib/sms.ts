import twilio from "twilio";

// Envoi de SMS via Twilio (https://www.twilio.com)
const accountSid = process.env.TWILO_SID;
const authToken = process.env.TWILO_AUTH;
const fromNumber = process.env.TWILO_PHONE_NUMBER || "+33757000000";
const restaurantPhone = process.env.RESTAURANT_PHONE || "+33612345678"; // Numéro de téléphone du restaurant pour les SMS sortants (ex: "+33 6 12 34 56 78")

let client: ReturnType<typeof twilio> | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Normalise un numéro de téléphone français en format E.164 (avec "+"),
 * tel qu'attendu par Twilio (ex: "0612345678" -> "+33612345678").
 */
function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+33${digits.slice(1)}`;
  return `+${digits}`;
}

export { toE164 };

export async function sendSmsReminder({
  to,
  name,
  date,
  time,
  guests,
  daysBefore = 1,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  daysBefore?: number;
}) {
  if (!client) {
    return null;
  }

  const messageIntro =
    daysBefore === 1
      ? "est prévue demain"
      : `est prévue dans ${daysBefore} jours`;

  const body = `ANØV — Bonjour ${name}, votre réservation pour ${guests} personne${guests > 1 ? "s" : ""} ${messageIntro}, le ${date} à ${time}. À bientôt ! Pour nous contacter : ${restaurantPhone}`;

  return client.messages.create({
    body,
    from: fromNumber,
    to: toE164(to),
  });
}
