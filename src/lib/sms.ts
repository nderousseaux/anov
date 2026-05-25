import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER || '+33757000000';

let client: ReturnType<typeof twilio> | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSmsReminder({
  to,
  name,
  date,
  time,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
}) {
  if (!client) {
    console.warn('Twilio not configured, skipping SMS');
    return;
  }
  return client.messages.create({
    body: `ANØV — Rappel : votre réservation est demain ${date} à ${time}. À bientôt, ${name} !`,
    from: fromNumber,
    to,
  });
}
