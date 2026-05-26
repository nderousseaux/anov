import { Resend } from 'resend';

// SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
// Le CMS est fonctionnel coté admin, le système de paiement sera activé ultérieurement
//
// if (!process.env.RESEND_API_KEY) {
//   throw new Error('RESEND_API_KEY is not set');
// }
//
// export const resend = new Resend(process.env.RESEND_API_KEY);
export const resend = null as any;

const FROM = 'ANØV <reservations@anov.fr>';

export async function sendConfirmationEmail({
  to,
  name,
  date,
  time,
  guests,
  cancelUrl,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl: string;
}) {
  // SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
  console.log('Envoi email de confirmation desactive - CMS admin uniquement');
  return null;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Confirmation de votre réservation — ANØV`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">ANØV</h1>
        <h2 style="font-size:20px;font-weight:normal;">Votre réservation est confirmée</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien enregistré votre réservation :</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${date}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;">${time}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Couverts</td><td style="padding:8px;">${guests} personne${guests > 1 ? 's' : ''}</td></tr>
        </table>
        <p>Pour annuler votre réservation :<br/>
          <a href="${cancelUrl}" style="color:#e3cb6b;">Annuler ma réservation</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">ANØV — Restaurant gastronomique · Besançon</p>
      </div>
    `,
  });
}

export async function sendReminderEmail({
  to,
  name,
  date,
  time,
  guests,
  cancelUrl,
}: {
  to: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  cancelUrl: string;
}) {
  // SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
  console.log('Envoi email de rappel desactive - CMS admin uniquement');
  return null;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Rappel — Votre réservation demain chez ANØV`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">ANØV</h1>
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
        <p style="color:#888;font-size:13px;">ANØV — Restaurant gastronomique · Besançon</p>
      </div>
    `,
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
  // SYSTEME DE PAIEMENT COMMENTE POUR L'INSTANT
  console.log('Envoi email d annulation desactive - CMS admin uniquement');
  return null;

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Annulation de votre réservation — ANØV`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:auto;color:#1a1a1a;">
        <h1 style="font-size:28px;color:#e3cb6b;margin-bottom:8px;">ANØV</h1>
        <h2 style="font-size:20px;font-weight:normal;">Réservation annulée</h2>
        <p>Bonjour ${name},</p>
        <p>Votre réservation du <strong>${date} à ${time}</strong> a bien été annulée.</p>
        <p>Nous espérons vous accueillir prochainement.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="color:#888;font-size:13px;">ANØV — Restaurant gastronomique · Besançon</p>
      </div>
    `,
  });
}
