import {
  isOwnMessage,
  generateMessageId,
  isMessageExpired,
} from './message.utils';

describe('message.utils', () => {
  describe('isOwnMessage', () => {
    it('returns true when user IDs match', () => {
      expect(isOwnMessage('user-123', 'user-123')).toBe(true);
    });

    it('returns false when user IDs do not match', () => {
      expect(isOwnMessage('user-123', 'user-456')).toBe(false);
    });

    it('handles empty strings', () => {
      expect(isOwnMessage('', '')).toBe(true);
      expect(isOwnMessage('user-123', '')).toBe(false);
    });
  });

  describe('generateMessageId', () => {
    it('generates a message ID', () => {
      const id = generateMessageId();
      expect(id).toBeDefined();
      expect(id.startsWith('msg-')).toBe(true);
    });

    it('generates unique IDs', () => {
      const id1 = generateMessageId();
      const id2 = generateMessageId();
      expect(id1).not.toBe(id2);
    });

    it('includes timestamp and random component', () => {
      const id = generateMessageId();
      expect(id).toMatch(/^msg-\d+-[a-z0-9]+$/);
    });
  });

  describe('isMessageExpired', () => {
    it('returns false when expiresAt is undefined', () => {
      expect(isMessageExpired(undefined)).toBe(false);
    });

    it('returns true when message has expired', () => {
      const pastTime = Date.now() - 5000;
      expect(isMessageExpired(pastTime)).toBe(true);
    });

    it('returns false when message has not expired', () => {
      const futureTime = Date.now() + 5000;
      expect(isMessageExpired(futureTime)).toBe(false);
    });

    it('uses provided current time', () => {
      const expiresAt = 10000;
      expect(isMessageExpired(expiresAt, 5000)).toBe(false);
      expect(isMessageExpired(expiresAt, 15000)).toBe(true);
    });

    it('returns true when current time equals expiration time', () => {
      const time = Date.now();
      expect(isMessageExpired(time, time)).toBe(true);
    });
  });
});
