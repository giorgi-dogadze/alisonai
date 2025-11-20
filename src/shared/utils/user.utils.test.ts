import {
  generateUserId,
  getUserInitials,
  generateSourceName,
  generateDefaultUsername,
} from './user.utils';

describe('user.utils', () => {
  describe('generateUserId', () => {
    it('generates a user ID', () => {
      const id = generateUserId();
      expect(id).toBeDefined();
      expect(id.startsWith('user-')).toBe(true);
    });

    it('generates unique IDs', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();
      expect(id1).not.toBe(id2);
    });

    it('has correct format', () => {
      const id = generateUserId();
      expect(id).toMatch(/^user-[a-z0-9]+$/);
    });
  });

  describe('getUserInitials', () => {
    it('returns initials for single name', () => {
      expect(getUserInitials('John')).toBe('J');
    });

    it('returns initials for full name', () => {
      expect(getUserInitials('John Doe')).toBe('JD');
    });

    it('returns initials for multiple names', () => {
      expect(getUserInitials('John Michael Doe')).toBe('JM');
    });

    it('respects maxInitials parameter', () => {
      expect(getUserInitials('John Michael Doe', 1)).toBe('J');
      expect(getUserInitials('John Michael Doe', 3)).toBe('JMD');
    });

    it('converts to uppercase', () => {
      expect(getUserInitials('john doe')).toBe('JD');
    });

    it('handles single character names', () => {
      expect(getUserInitials('A B')).toBe('AB');
    });

    it('handles long names', () => {
      expect(getUserInitials('Alexander Benjamin Christopher')).toBe('AB');
    });
  });

  describe('generateSourceName', () => {
    it('generates source name from user ID', () => {
      const userId = 'user-abc123';
      const sourceName = generateSourceName(userId);
      expect(sourceName).toBe('tab-abc123');
    });

    it('uses last 6 characters', () => {
      const userId = 'user-123456789';
      const sourceName = generateSourceName(userId);
      expect(sourceName.length).toBe(10);
      expect(sourceName.startsWith('tab-')).toBe(true);
    });

    it('handles short user IDs', () => {
      const userId = 'user-abc';
      const sourceName = generateSourceName(userId);
      expect(sourceName).toBe('tab-er-abc');
    });
  });

  describe('generateDefaultUsername', () => {
    it('generates default username from user ID', () => {
      const userId = 'user-abc123';
      const username = generateDefaultUsername(userId);
      expect(username).toBe('User-abc123');
    });

    it('uses last 6 characters', () => {
      const userId = 'user-123456789';
      const username = generateDefaultUsername(userId);
      expect(username.startsWith('User-')).toBe(true);
    });

    it('handles short user IDs', () => {
      const userId = 'user-abc';
      const username = generateDefaultUsername(userId);
      expect(username).toBe('User-er-abc');
    });

    it('generates consistent usernames for same ID', () => {
      const userId = 'user-xyz789';
      expect(generateDefaultUsername(userId)).toBe(
        generateDefaultUsername(userId)
      );
    });
  });
});
