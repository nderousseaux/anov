import nodemailer from 'nodemailer';

// Configuration du serveur SMTP
// SMTP is configured via environment variables - logs handled externally if needed

function createTransporter() {
  if (!process.env.SMTP_HOST) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASSWORD ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    } : undefined,
  });
}

// Générer un fichier .ics pour le calendrier
function generateICS({
  date,
  time,
  name,
  guests,
  durationMinutes = 90,
}: {
  date: string;
  time: string;
  name: string;
  guests: number;
  durationMinutes?: number;
}): string {
  // Parse la date pour créer l'ID unique ICS
  const dateObj = new Date(date);
  const uid = `${dateObj.getTime()}@anov.fr`;

  // Construire la datetime ICS en heure de Paris (équivalent à UTC+1 ou UTC+2)
  // On utilise un format avec timezone info: YYYYMMDDTHHMMSS avec TZID=Europe/Paris
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  // Extraire l'heure à partir du paramètre time (format: "19:00" ou "19h00")
  let hours = '19';
  let minutes = '00';
  const timeParts = time.split(/[:h]/).filter(Boolean);
  if (timeParts.length >= 2) {
    hours = String(parseInt(timeParts[0])).padStart(2, '0');
    minutes = String(parseInt(timeParts[1])).padStart(2, '0');
  }

  // Format ICS avec timezone Europe/Paris
  // DTSTAMP doit être en UTC (suffixe 'Z')
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  // Calculer l'heure de fin en ajoutant la durée du repas
  const durationMs = durationMinutes * 60 * 1000;
  const startDate = new Date(Date.parse(`${year}-${month}-${day}T${hours}:${minutes}:00`));
  const endDate = new Date(startDate.getTime() + durationMs);

  // Format ICS avec timezone Europe/Paris
  const dtstart = `${year}${month}${day}T${hours}${minutes}00`;
  const dtendYear = endDate.getFullYear();
  const dtendMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const dtendDay = String(endDate.getDate()).padStart(2, '0');
  const dtendHours = String(endDate.getHours()).padStart(2, '0');
  const dtendMinutes = String(endDate.getMinutes()).padStart(2, '0');
  const dtend = `${dtendYear}${dtendMonth}${dtendDay}T${dtendHours}${dtendMinutes}00`;

  // Ajouter les props de timezone pour Europe/Paris
  const timezoneProps = `
BEGIN:VTIMEZONE
TZID:Europe/Paris
X-LIC-LOCATION:Europe/Paris
BEGIN:STANDARD
DTSTART:19701026T030000
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19700329T020000
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3
END:DAYLIGHT
END:VTIMEZONE
`.trim();

  // Description complète avecBesoin d'annuler et numéro de téléphone + adresse complète
  const description = `Réservation de ${name} pour ${guests} personne${guests > 1 ? 's' : ''}.\n\nLieu: ${RESTAURANT_ADDRESS}\n\nBesoin d'annuler ?\nAppelez-nous au ${RESTAURANT_PHONE}`;

  // Échapper les caractères spéciaux pour iCalendar (backslash, newline, etc.)
  const escapeIcsText = (text: string) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\r/g, '');
  };

  // LOCATION avec échappement des virgules pour Apple Calendar
  // En iCalendar, les virgules dans LOCATION doivent être échappées avec \
  // Apple Calendar affiche souvent seulement 50-100 caractères pour LOCATION
  // Donc on échappe les virgules avec \, pour préserver l'adresse complète
  const locationValue = RESTAURANT_ADDRESS.replace(/,/g, '\\,');

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//l'Anøv//Reservation//FR
${timezoneProps}
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART;TZID=Europe/Paris:${dtstart}
DTEND;TZID=Europe/Paris:${dtend}
SUMMARY:Réservation chez l'Anøv
DESCRIPTION:${escapeIcsText(description)}
LOCATION:${locationValue}
END:VEVENT
END:VCALENDAR`;
}

// Transporteur nodemailer (crée dynamiquement pour charger les variables d'environnement)
let transporter: any = null;

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

// Adresse du restaurant (variable d'environnement)
// On garde l'adresse complète sans guillemets, mais on s'assure que le format est correct
// L'adresse complète sera: 12 Rue de la République, 75001 Paris, France
const RESTAURANT_ADDRESS_RAW = (process.env.RESTAURANT_ADDRESS || '12 Rue de la République, 25000 Besançon').replace(/^"|"$/g, '');

// Pour l'affichage dans le calendrier, on formate l'adresse pour éviter que Google Calendar ne la tronque
// Google Calendar affiche environ 100-150 caractères pour LOCATION
const RESTAURANT_ADDRESS = RESTAURANT_ADDRESS_RAW;

// Téléphone du restaurant
const RESTAURANT_PHONE = (process.env.RESTAURANT_PHONE || '+33 1 45 67 89 00').replace(/^"|"$/g, '');

const FROM = process.env.SMTP_FROM || "l'Anøv <noreply@anov.fr>";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@anovrestaurant.fr';

export async function sendConfirmationEmail({
  to,
  name,
  date,
  time,
  guests,
  cancelUrl,
  icsDate,
  durationMinutes = 90,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl?: string;
  icsDate?: string;
  durationMinutes?: number;
}) {
  const t = getTransporter();
  if (!t) {
    console.log('[EMAIL] Transporteur SMTP non configuré, email non envoyé à', to);
    return null;
  }

  // Générer le fichier .ics (utiliser icsDate si fourni, sinon date)
  const icsContent = generateICS({
    date: icsDate || date,
    time,
    name,
    guests,
    durationMinutes
  });

  console.log(`[EMAIL] Envoi de l'email de confirmation à ${to}`);
  console.log(`[EMAIL] Contenu ICS:\n${icsContent}`);

  return t.sendMail({
    from: FROM,
    to,
    subject: `Confirmation de votre réservation — l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Votre réservation est confirmée</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien enregistré votre réservation :</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${date}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;">${time}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Couverts</td><td style="padding:8px;">${guests} personne${guests > 1 ? 's' : ''}</td></tr>
        </table>
        <p style="margin-top:16px;">Besoin d'annuler ?<br/>
          Appeler nous au <a href="tel:${RESTAURANT_PHONE}" style="color:#e3cb6b;">${RESTAURANT_PHONE}</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">l'Anøv — · Besançon</p>
      </div>
    `,
    attachments: [
      {
        filename: 'reservation.ics',
        content: icsContent,
        contentType: 'text/calendar; charset=utf-8',
      },
    ],
  });
}

export async function sendReminderEmail({
  to,
  name,
  date,
  time,
  guests,
  cancelUrl,
  icsDate,
  durationMinutes = 90,
  daysBefore = 1,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl: string;
  icsDate?: string;
  durationMinutes?: number;
  daysBefore?: number;
}) {
  const t = getTransporter();
  if (!t) {
    // Email service disabled - SMTP not configured
    return null;
  }

  // Générer le fichier .ics (utiliser icsDate si fourni, sinon date)
  const icsContent = generateICS({
    date: icsDate || date,
    time,
    name,
    guests,
    durationMinutes
  });

  // Message différent selon le nombre de jours avant
  const messageIntro = daysBefore === 1
    ? "Votre réservation est prévue demain"
    : `Votre réservation est prévue dans ${daysBefore} jours`;

  return t.sendMail({
    from: FROM,
    to,
    subject: `Rappel — Votre réservation chez l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Rappel de votre réservation</h2>
        <p>Bonjour ${name},</p>
        <p>Nous vous rappelons votre prochaine réservation :</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${date}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;">${time}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Couverts</td><td style="padding:8px;">${guests} personne${guests > 1 ? 's' : ''}</td></tr>
        </table>
        <p style="margin-top:16px;">${messageIntro}.</p>
        <p style="margin-top:16px;">Besoin d'annuler ou modifier ?<br/>
          Appeler nous au <a href="tel:${RESTAURANT_PHONE}" style="color:#e3cb6b;">${RESTAURANT_PHONE}</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">l'Anøv — · Besançon</p>
      </div>
    `,
    attachments: [
      {
        filename: 'reservation.ics',
        content: icsContent,
        contentType: 'text/calendar; charset=utf-8',
      },
    ],
  });
}

export async function sendCancellationEmail({
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
  const t = getTransporter();
  if (!t) {
    // Email service disabled - SMTP not configured
    return null;
  }

  return t.sendMail({
    from: FROM,
    to,
    subject: `Annulation de votre réservation — l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Réservation annulée</h2>
        <p>Bonjour ${name},</p>
        <p>Votre réservation du <strong>${date} à ${time}</strong> a bien été annulée.</p>
        <p>Pour toute information, appelez-nous au <a href="tel:${RESTAURANT_PHONE}" style="color:#e3cb6b;">${RESTAURANT_PHONE}</a>.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">l'Anøv — · Besançon</p>
      </div>
    `,
  });
}

// Nouvelles fonctions pour le formulaire de contact

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const t = getTransporter();
  if (!t) {
    // Email service disabled - SMTP not configured
    return null;
  }

  return t.sendMail({
    from: FROM,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `[Contact l'Anøv] ${subject}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Nouveau message de contact</h2>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Nom</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Sujet</td><td style="padding:8px;border-bottom:1px solid #eee;">${subject}</td></tr>
        </table>
        <div style="padding:16px;background:#f5f5f5;border-left:4px solid #e3cb6b;margin:16px 0;">
          <p style="margin:0;white-space:pre-wrap;">${message}</p>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">Pour répondre, utilisez l'adresse : ${email}</p>
      </div>
    `,
  });
}

export async function sendContactConfirmation({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const t = getTransporter();
  if (!t) {
    // Email service disabled - SMTP not configured
    return null;
  }

  return t.sendMail({
    from: FROM,
    to,
    subject: `Message reçu — l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Nous avons bien reçu votre message</h2>
        <p>Bonjour ${name},</p>
        <p>Merci de nous avoir contactés. Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <p>À très bientôt !</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">l'Anøv — · Besançon</p>
      </div>
    `,
  });
}

// Fonctions pour les chèques cadeaux

export async function sendGiftCardEmail({
  to,
  code,
  amount,
  personalMessage,
  expiresAt,
}: {
  to: string;
  code: string;
  amount: number;
  personalMessage?: string;
  expiresAt: string;
}) {
  const t = getTransporter();
  if (!t) {
    // Email service disabled - SMTP not configured
    return null;
  }

  return t.sendMail({
    from: FROM,
    to,
    subject: `Vous avez reçu un chèque cadeau l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Vous avez reçu un chèque cadeau !</h2>
        ${personalMessage ? `
          <div style="padding:16px;background:#f5f5f5;border-left:4px solid #e3cb6b;margin:16px 0;">
            <p style="margin:0;white-space:pre-wrap;font-style:italic;">${personalMessage}</p>
          </div>
        ` : ''}
        <p>Félicitations ! Vous avez reçu un chèque cadeau pour une expérience gastronomique chez l'Anøv.</p>
        <div style="background:#f8f4e8;padding:24px;border-radius:8px;margin:24px 0;text-align:center;">
          <p style="font-size:14px;color:#888;margin:0 0 8px 0;">Montant du chèque cadeau</p>
          <p style="font-size:36px;color:#e3cb6b;font-weight:bold;margin:0 0 16px 0;">${amount}€</p>
          <p style="font-size:14px;color:#888;margin:0 0 8px 0;">Code du chèque cadeau</p>
          <p style="font-size:24px;color:#1a1a1a;font-weight:bold;letter-spacing:2px;margin:0;font-family:monospace;">${code}</p>
        </div>
        <p><strong>Comment utiliser votre chèque cadeau :</strong></p>
        <ol style="line-height:1.8;">
          <li>Réservez votre table sur notre site ou par téléphone</li>
          <li>Présentez ce code lors de votre visite</li>
          <li>Profitez de votre expérience gastronomique !</li>
        </ol>
        <p style="color:#888;font-size:13px;margin-top:24px;">
          Valable jusqu'au ${expiresAt}<br/>
          Ce chèque cadeau est valable pour toute consommation chez l'Anøv.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">l'Anøv — · Besançon</p>
      </div>
    `,
  });
}
