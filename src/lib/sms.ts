// Envoi de SMS via GatewayAPI (https://gatewayapi.com)
const GATEWAYAPI_URL = 'https://messaging.gatewayapi.com/mobile/single';
const token = process.env.GATEWAYAPI_TOKEN;
const sender = process.env.GATEWAYAPI_SENDER || 'ANOV';

/**
 * Normalise un numéro de téléphone français en MSISDN numérique (sans "+"),
 * tel qu'attendu par GatewayAPI (ex: "+33 6 12 34 56 78" ou "0612345678" -> 33612345678).
 */
function normalizePhoneNumber(phone: string): number {
  const digits = phone.replace(/[^\d+]/g, '');
  const normalized = digits.startsWith('+')
    ? digits.slice(1)
    : digits.startsWith('0')
      ? `33${digits.slice(1)}`
      : digits;
  return Number(normalized);
}

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
  if (!token) {
    console.warn('GatewayAPI non configuré, SMS ignoré');
    return null;
  }

  const messageIntro = daysBefore === 1
    ? 'est prévue demain'
    : `est prévue dans ${daysBefore} jours`;

  const message = `ANØV — Bonjour ${name}, votre réservation pour ${guests} personne${guests > 1 ? 's' : ''} ${messageIntro}, le ${date} à ${time}. À bientôt !`;

  const body = {
    sender,
    message,
    recipient: normalizePhoneNumber(to),
  };

  const response = await fetch(GATEWAYAPI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GatewayAPI error (${response.status}): ${errorText}`);
  }

  return response.json();
}
