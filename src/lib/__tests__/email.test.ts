import { describe, it, expect } from "vitest";
import { generateICS } from "../email";

describe("email", () => {
  describe("generateICS", () => {
    it("generates valid ICS content", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Jean Dupont",
        guests: 4,
        durationMinutes: 90,
      });

      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("VERSION:2.0");
      expect(ics).toContain("PRODID:-//l'Anøv//Reservation//FR");
      expect(ics).toContain("BEGIN:VEVENT");
      expect(ics).toContain("DTSTART");
      expect(ics).toContain("DTEND");
      expect(ics).toContain("SUMMARY:Réservation chez l'Anøv");
      expect(ics).toContain("LOCATION:");
      expect(ics).toContain("BEGIN:VTIMEZONE");
      expect(ics).toContain("TZID:Europe/Paris");
    });

    it("handles different time formats (with h separator)", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19h30",
        name: "Test",
        guests: 2,
      });

      expect(ics).toContain("DTSTART");
      expect(ics).toContain("DTEND");
    });

    it("includes timezone definition for Europe/Paris", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
      });

      expect(ics).toContain("BEGIN:VTIMEZONE");
      expect(ics).toContain("TZID:Europe/Paris");
      expect(ics).toContain("BEGIN:STANDARD");
      expect(ics).toContain("BEGIN:DAYLIGHT");
    });

    it("calculates end time correctly based on duration", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
        durationMinutes: 120,
      });

      // Start: 19:00, duration 120min -> End: 21:00
      expect(ics).toContain("DTEND;TZID=Europe/Paris:20240615T210000");
    });

    it("escapes special characters in ICS description", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
      });

      // Check that special chars are escaped
      expect(ics).toContain("\\n");
      expect(ics).toContain("\\,");
    });

    it("includes UID based on date", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
      });

      expect(ics).toMatch(/UID:\d+@anov\.fr/);
    });

    it("handles different dates correctly", () => {
      const ics = generateICS({
        date: "2024-12-25",
        time: "20:00",
        name: "Noel",
        guests: 6,
      });

      expect(ics).toContain("DTSTART;TZID=Europe/Paris:20241225T200000");
    });

    it("uses correct date format in ICS", () => {
      const ics = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
      });

      // YYYYMMDDTHHMMSS format
      expect(ics).toContain("DTSTART");
    });

    it("generates correct duration for different meal lengths", () => {
      const ics60 = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
        durationMinutes: 60,
      });

      const ics120 = generateICS({
        date: "2024-06-15",
        time: "19:00",
        name: "Test",
        guests: 2,
        durationMinutes: 120,
      });

      expect(ics60).not.toBe(ics120);
    });
  });
});
