import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMail = vi.fn().mockResolvedValue({ messageId: "m1" });

vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

async function load() {
  vi.resetModules();
  process.env.SMTP_HOST = "smtp.test.com";
  return import("../email");
}

describe("sendReservationUnavailableEmail", () => {
  beforeEach(() => {
    sendMail.mockClear();
  });

  const params = {
    to: "client@example.com",
    name: "Jean Dupont",
    date: "mardi 3 novembre",
    time: "19:30",
  };

  it("explique que la table n'était plus disponible et que le paiement est remboursé", async () => {
    const { sendReservationUnavailableEmail } = await load();

    await sendReservationUnavailableEmail({ ...params, refundedCents: 8000 });

    expect(sendMail).toHaveBeenCalledTimes(1);
    const mail = sendMail.mock.calls[0][0];
    expect(mail.to).toBe("client@example.com");
    expect(mail.subject).toBe(
      "Votre réservation n'a pas pu être confirmée — l'Anøv",
    );
    expect(mail.html).toContain("Jean Dupont");
    expect(mail.html).toContain("mardi 3 novembre à 19:30");
    expect(mail.html).toContain("n&apos;était plus disponible");
    expect(mail.html).toContain("intégralement remboursé");
    expect(mail.html).toContain("80,00&nbsp;€");
    expect(mail.html).toContain("tel:");
  });

  it("n'est pas formulé comme une annulation demandée par le client", async () => {
    const { sendReservationUnavailableEmail } = await load();

    await sendReservationUnavailableEmail(params);

    const html = sendMail.mock.calls[0][0].html as string;
    expect(html).not.toContain("a bien été annulée");
  });

  it("omet le montant quand il est inconnu, sans inventer de chiffre", async () => {
    const { sendReservationUnavailableEmail } = await load();

    await sendReservationUnavailableEmail({ ...params, refundedCents: null });
    await sendReservationUnavailableEmail({ ...params, refundedCents: 0 });

    for (const [mail] of sendMail.mock.calls) {
      expect(mail.html).toContain("intégralement remboursé");
      expect(mail.html).not.toMatch(/\d+,\d{2}&nbsp;€/);
    }
  });

  it("échappe le nom saisi par le client", async () => {
    const { sendReservationUnavailableEmail } = await load();

    await sendReservationUnavailableEmail({
      ...params,
      name: '<script>alert("x")</script>',
    });

    const html = sendMail.mock.calls[0][0].html as string;
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("ne fait rien quand le SMTP n'est pas configuré", async () => {
    vi.resetModules();
    delete process.env.SMTP_HOST;
    const { sendReservationUnavailableEmail } = await import("../email");

    expect(await sendReservationUnavailableEmail(params)).toBeNull();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
