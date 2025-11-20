import {
  getRelativeTime,
  formatTime,
  getExpirationCountdown,
} from './time.utils';

describe('time.utils', () => {
  describe('getRelativeTime', () => {
    it('returns "-" for undefined timestamp', () => {
      expect(getRelativeTime(Date.now(), undefined)).toBe('-');
    });

    it('returns "just now" for very recent times', () => {
      const now = Date.now();
      expect(getRelativeTime(now, now - 1000)).toBe('just now');
    });

    it('returns seconds ago for times under a minute', () => {
      const now = Date.now();
      expect(getRelativeTime(now, now - 30000)).toBe('30s ago');
      expect(getRelativeTime(now, now - 45000)).toBe('45s ago');
    });

    it('returns minutes ago for times under an hour', () => {
      const now = Date.now();
      expect(getRelativeTime(now, now - 120000)).toBe('2m ago');
      expect(getRelativeTime(now, now - 600000)).toBe('10m ago');
    });

    it('returns hours ago for longer times', () => {
      const now = Date.now();
      expect(getRelativeTime(now, now - 3600000)).toBe('1h ago');
      expect(getRelativeTime(now, now - 7200000)).toBe('2h ago');
    });
  });

  describe('formatTime', () => {
    it('formats timestamp to time string', () => {
      const timestamp = new Date('2024-01-01T14:30:00').getTime();
      const formatted = formatTime(timestamp);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats different times correctly', () => {
      const morning = new Date('2024-01-01T09:15:00').getTime();
      const evening = new Date('2024-01-01T18:45:00').getTime();

      expect(formatTime(morning)).toBeDefined();
      expect(formatTime(evening)).toBeDefined();
    });
  });

  describe('getExpirationCountdown', () => {
    it('returns null for undefined expiration', () => {
      expect(getExpirationCountdown(undefined, Date.now())).toBeNull();
    });

    it('returns "Expiring..." when time has run out', () => {
      const now = Date.now();
      expect(getExpirationCountdown(now - 1000, now)).toBe('Expiring...');
      expect(getExpirationCountdown(now, now)).toBe('Expiring...');
    });

    it('returns seconds for times under a minute', () => {
      const now = Date.now();
      expect(getExpirationCountdown(now + 30000, now)).toBe('30s');
      expect(getExpirationCountdown(now + 45000, now)).toBe('45s');
    });

    it('returns minutes and seconds for longer times', () => {
      const now = Date.now();
      expect(getExpirationCountdown(now + 90000, now)).toBe('1m 30s');
      expect(getExpirationCountdown(now + 125000, now)).toBe('2m 5s');
    });

    it('handles exact minute boundaries', () => {
      const now = Date.now();
      expect(getExpirationCountdown(now + 60000, now)).toBe('1m 0s');
      expect(getExpirationCountdown(now + 120000, now)).toBe('2m 0s');
    });
  });
});
