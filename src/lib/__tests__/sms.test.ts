import { describe, it, expect } from 'vitest';
import { toE164, sendSmsReminder } from '../sms';

describe('sms', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.TWILO_SID;
    delete process.env.TWILO_AUTH;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('toE164', () => {
    it('converts French number with leading 0 to E.164', () => {
      expect(toE164('0612345678')).toBe('+33612345678');
    });

    it('converts French number with spaces to E.164', () => {
      expect(toE164('06 12 34 56 78')).toBe('+33612345678');
    });

    it('converts French number with dashes to E.164', () => {
      expect(toE164('06-12-34-56-78')).toBe('+33612345678');
    });

    it('keeps number already in E.164 format', () => {
      expect(toE164('+33612345678')).toBe('+33612345678');
    });

    it('keeps number starting with +', () => {
      expect(toE164('+447700900000')).toBe('+447700900000');
    });

    it('removes non-numeric characters except leading +', () => {
      expect(toE164('06.12.34.56.78')).toBe('+33612345678');
    });
  });

  describe('sendSmsReminder', () => {
    it('returns null when Twilio not configured', async () => {
      const result = await sendSmsReminder({
        to: '0612345678',
        name: 'Jean Dupont',
        date: '2024-06-15',
        time: '19:00',
        guests: 4,
        daysBefore: 1,
      });

      expect(result).toBeNull();
    });
  });
});