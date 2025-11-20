import { generateUserId } from './generateUserId';

describe('generateUserId', () => {
  it('generates a user ID with correct prefix', () => {
    const id = generateUserId();
    expect(id.startsWith('user-')).toBe(true);
  });

  it('generates unique IDs on multiple calls', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateUserId());
    }
    expect(ids.size).toBe(100);
  });

  it('generates IDs with correct format', () => {
    const id = generateUserId();
    expect(id).toMatch(/^user-[a-z0-9]{9}$/);
  });

  it('generates non-empty IDs', () => {
    const id = generateUserId();
    expect(id.length).toBeGreaterThan(5);
  });
});
