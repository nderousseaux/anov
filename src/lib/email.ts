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
}: {
  date: string;
  time: string;
  name: string;
  guests: number;
}): string {
  // Parse la date pour créer l'ID unique ICS
  const dateObj = new Date(date);
  const uid = `${dateObj.getTime()}@anov.fr`;
  const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtstart = dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtend = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 3 heures

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//l'Anøv//Reservation//FR
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:Réservation chez l'Anøv
DESCRIPTION:Réservation de ${name} pour ${guests} personne${guests > 1 ? 's' : ''}.
LOCATION:${RESTAURANT_ADDRESS}
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
const RESTAURANT_ADDRESS = process.env.RESTAURANT_ADDRESS || '12 Rue de la République, 25000 Besançon';

const FROM = process.env.SMTP_FROM || "l'Anøv <noreply@anov.fr>";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@anov.fr';

export async function sendConfirmationEmail({
  to,
  name,
  date,
  time,
  guests,
  cancelUrl,
  icsDate,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl?: string;
  icsDate?: string;
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
    guests
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
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl: string;
  icsDate?: string;
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
    guests
  });

  return t.sendMail({
    from: FROM,
    to,
    subject: `Rappel — Votre réservation demain chez l'Anøv`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">l'Anøv</h1>
        <h2 style="font-size:20px;font-weight:normal;">Votre réservation est demain</h2>
        <p>Bonjour ${name},</p>
        <p>Nous vous rappelons votre réservation pour demain :</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${date}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;">${time}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Couverts</td><td style="padding:8px;">${guests} personne${guests > 1 ? 's' : ''}</td></tr>
        </table>
        <p>Besoin d'annuler ?<br/>
          <a href="${cancelUrl}" style="color:#e3cb6b;">Annuler ma réservation</a>
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
        <p>Nous espérons vous accueillir prochainement.</p>
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
