import { isOwnMessage } from './isOwnMessage';

describe('isOwnMessage', () => {
  it('returns true when user IDs match', () => {
    expect(
      isOwnMessage({ currentUserId: 'user-123', messageUserId: 'user-123' })
    ).toBe(true);
  });

  it('returns false when user IDs do not match', () => {
    expect(
      isOwnMessage({ currentUserId: 'user-123', messageUserId: 'user-456' })
    ).toBe(false);
  });

  it('handles empty strings', () => {
    expect(isOwnMessage({ currentUserId: '', messageUserId: '' })).toBe(true);
    expect(isOwnMessage({ currentUserId: 'user-123', messageUserId: '' })).toBe(
      false
    );
  });

  it('is case sensitive', () => {
    expect(
      isOwnMessage({ currentUserId: 'User-123', messageUserId: 'user-123' })
    ).toBe(false);
  });

  it('handles special characters', () => {
    expect(
      isOwnMessage({ currentUserId: 'user-@#$', messageUserId: 'user-@#$' })
    ).toBe(true);
  });
});
