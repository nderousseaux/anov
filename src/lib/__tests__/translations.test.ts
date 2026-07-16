import { describe, it, expect } from "vitest";

describe("translations", () => {
  describe("fr", () => {
    it("exports French translations", async () => {
      const { fr } = await import("../translations");
      expect(fr).toBeDefined();
      expect(typeof fr).toBe("object");
    });

    it("contains nav section", async () => {
      const { fr } = await import("../translations");
      expect(fr.nav).toBeDefined();
      expect(fr.nav.ourStory).toBe("Notre Histoire");
      expect(fr.nav.gallery).toBe("Galerie");
      expect(fr.nav.theMenu).toBe("La Carte");
    });

    it("contains footer section", async () => {
      const { fr } = await import("../translations");
      expect(fr.footer).toBeDefined();
      expect(fr.footer.followUs).toBe("Suivez-nous");
      expect(fr.footer.copyright).toBe("© 2026 l'Anøv · Tous droits réservés.");
    });

    it("contains reservation section", async () => {
      const { fr } = await import("../translations");
      expect(fr.reservation).toBeDefined();
      expect(fr.reservation.title).toBe("Réserver une table");
      expect(fr.reservation.name).toBe("Nom complet");
    });

    it("contains gallery section", async () => {
      const { fr } = await import("../translations");
      expect(fr.gallery).toBeDefined();
      expect(fr.gallery.title).toBe("Galerie");
    });

    it("contains contact section", async () => {
      const { fr } = await import("../translations");
      expect(fr.contact).toBeDefined();
      expect(fr.contact.name).toBe("Nom");
      expect(fr.contact.email).toBe("Email");
    });

    it("contains boutique section", async () => {
      const { fr } = await import("../translations");
      expect(fr.boutique).toBeDefined();
      expect(fr.boutique.title).toBe("Nos Produits");
    });

    it("contains hero section", async () => {
      const { fr } = await import("../translations");
      expect(fr.hero).toBeDefined();
      expect(fr.hero.reserve).toBe("Réserver une table");
    });
  });

  describe("en", () => {
    it("exports English translations", async () => {
      const { en } = await import("../translations");
      expect(en).toBeDefined();
      expect(typeof en).toBe("object");
    });

    it("contains nav section", async () => {
      const { en } = await import("../translations");
      expect(en.nav).toBeDefined();
      expect(en.nav.ourStory).toBe("Our Story");
      expect(en.nav.gallery).toBe("Gallery");
      expect(en.nav.theMenu).toBe("Menu");
    });

    it("contains footer section", async () => {
      const { en } = await import("../translations");
      expect(en.footer).toBeDefined();
      expect(en.footer.followUs).toBe("Follow Us");
      expect(en.footer.copyright).toBe("© 2026 l'Anøv · All rights reserved.");
    });

    it("contains reservation section", async () => {
      const { en } = await import("../translations");
      expect(en.reservation).toBeDefined();
      expect(en.reservation.title).toBe("Book a table");
      expect(en.reservation.name).toBe("Full name");
    });

    it("contains gallery section", async () => {
      const { en } = await import("../translations");
      expect(en.gallery).toBeDefined();
      expect(en.gallery.title).toBe("Gallery");
    });

    it("contains contact section", async () => {
      const { en } = await import("../translations");
      expect(en.contact).toBeDefined();
      expect(en.contact.name).toBe("Name");
      expect(en.contact.email).toBe("Email");
    });

    it("contains boutique section", async () => {
      const { en } = await import("../translations");
      expect(en.boutique).toBeDefined();
      expect(en.boutique.title).toBe("Our Products");
    });

    it("contains hero section", async () => {
      const { en } = await import("../translations");
      expect(en.hero).toBeDefined();
      expect(en.hero.reserve).toBe("Book a table");
    });
  });

  describe("de", () => {
    it("exports German translations", async () => {
      const { de } = await import("../translations");
      expect(de).toBeDefined();
      expect(typeof de).toBe("object");
    });

    it("contains nav section", async () => {
      const { de } = await import("../translations");
      expect(de.nav).toBeDefined();
      expect(de.nav.ourStory).toBe("Unsere Geschichte");
      expect(de.nav.gallery).toBe("Galerie");
      expect(de.nav.theMenu).toBe("Speisekarte");
    });

    it("contains footer section", async () => {
      const { de } = await import("../translations");
      expect(de.footer).toBeDefined();
      expect(de.footer.followUs).toBe("Folgen Sie uns");
      expect(de.footer.copyright).toBe(
        "© 2026 l'Anøv · Alle Rechte vorbehalten.",
      );
    });

    it("contains reservation section", async () => {
      const { de } = await import("../translations");
      expect(de.reservation).toBeDefined();
      expect(de.reservation.title).toBe("Tisch reservieren");
      expect(de.reservation.name).toBe("Vollständiger Name");
    });

    it("contains gallery section", async () => {
      const { de } = await import("../translations");
      expect(de.gallery).toBeDefined();
      expect(de.gallery.title).toBe("Galerie");
    });

    it("contains contact section", async () => {
      const { de } = await import("../translations");
      expect(de.contact).toBeDefined();
      expect(de.contact.name).toBe("Name");
      expect(de.contact.email).toBe("E-Mail");
    });

    it("contains boutique section", async () => {
      const { de } = await import("../translations");
      expect(de.boutique).toBeDefined();
      expect(de.boutique.title).toBe("Produkte");
    });

    it("contains hero section", async () => {
      const { de } = await import("../translations");
      expect(de.hero).toBeDefined();
      expect(de.hero.reserve).toBe("Tisch reservieren");
    });
  });

  describe("exports", () => {
    it("exports all translation files", async () => {
      const translations = await import("../translations");
      expect(translations.fr).toBeDefined();
      expect(translations.en).toBeDefined();
      expect(translations.de).toBeDefined();
    });

    it("each translation has consistent structure", async () => {
      const { fr, en, de } = await import("../translations");

      // Check that all languages have the same top-level keys
      const expectedKeys = Object.keys(fr);
      expect(Object.keys(en)).toEqual(expect.arrayContaining(expectedKeys));
      expect(Object.keys(de)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
