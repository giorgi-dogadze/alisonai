import { render, screen, fireEvent } from '@testing-library/react';
import { UserPresence } from './UserPresence';
import type { User } from '@/types/collaboration';

jest.mock('@/shared/hooks', () => ({
  useCurrentTime: jest.fn(() => Date.now()),
}));

describe('UserPresence', () => {
  const mockCurrentUser: User = {
    id: 'user-1',
    name: 'John Doe',
    lastActivity: Date.now(),
    isTyping: false,
  };

  const mockUsers: User[] = [
    mockCurrentUser,
    {
      id: 'user-2',
      name: 'Jane Smith',
      lastActivity: Date.now() - 5000,
      isTyping: false,
    },
    {
      id: 'user-3',
      name: 'Bob Johnson',
      lastActivity: Date.now(),
      isTyping: true,
    },
  ];

  const mockOnUpdateUsername = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user presence with active users count', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    expect(screen.getByText(/Active Users \(3\)/i)).toBeInTheDocument();
  });

  it('displays current user information', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getAllByText('You')).toHaveLength(2);
  });

  it('displays other users', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('enters edit mode when Edit button is clicked', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('updates username and calls onUpdateUsername', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Name' } });

    const saveButton = screen.getAllByRole('button')[0];
    fireEvent.click(saveButton);

    expect(mockOnUpdateUsername).toHaveBeenCalledWith('New Name');
  });

  it('cancels edit without saving', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Name' } });

    const cancelButton = screen.getAllByRole('button')[1];
    fireEvent.click(cancelButton);

    expect(mockOnUpdateUsername).not.toHaveBeenCalled();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows typing indicator for typing users', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={mockUsers}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    expect(screen.getByText('Typing')).toBeInTheDocument();
  });

  it('displays empty state when no other users', () => {
    render(
      <UserPresence
        currentUser={mockCurrentUser}
        users={[mockCurrentUser]}
        onUpdateUsername={mockOnUpdateUsername}
      />
    );

    expect(screen.getByText('No other tabs active')).toBeInTheDocument();
    expect(
      screen.getByText('Open this page in another tab!')
    ).toBeInTheDocument();
  });
});
