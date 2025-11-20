import { render, screen, fireEvent } from '@testing-library/react';
import { ChatBox } from './ChatBox';
import type { Message, User } from '@/types/collaboration';

jest.mock('@/shared/hooks', () => ({
  useCurrentTime: jest.fn(() => Date.now()),
}));

describe('ChatBox', () => {
  const mockCurrentUser: User = {
    id: 'user-1',
    name: 'John Doe',
    lastActivity: Date.now(),
    isTyping: false,
  };

  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      userId: 'user-1',
      username: 'John Doe',
      content: 'Hello everyone!',
      timestamp: Date.now() - 1000,
    },
    {
      id: 'msg-2',
      userId: 'user-2',
      username: 'Jane Smith',
      content: 'Hi there!',
      timestamp: Date.now() - 500,
    },
  ];

  const mockTypingUsers: User[] = [
    {
      id: 'user-3',
      name: 'Bob',
      lastActivity: Date.now(),
      isTyping: true,
    },
  ];

  const mockDeleteMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat box with messages', () => {
    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={[]}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    expect(screen.getByText('Chat Messages')).toBeInTheDocument();
    expect(screen.getByText('Hello everyone!')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('displays empty state when no messages', () => {
    render(
      <ChatBox
        messages={[]}
        currentUser={mockCurrentUser}
        typingUsers={[]}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    expect(
      screen.getByText('No messages yet. Start the conversation!')
    ).toBeInTheDocument();
  });

  it('shows delete button only for own messages', () => {
    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={[]}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons).toHaveLength(1);
  });

  it('calls onDeleteMessage when delete button is clicked', () => {
    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={[]}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockDeleteMessage).toHaveBeenCalledWith('msg-1');
  });

  it('displays typing indicator for single user', () => {
    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={mockTypingUsers}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    expect(screen.getByText('Bob is typing...')).toBeInTheDocument();
  });

  it('displays typing indicator for multiple users', () => {
    const multipleTypingUsers: User[] = [
      ...mockTypingUsers,
      {
        id: 'user-4',
        name: 'Alice',
        lastActivity: Date.now(),
        isTyping: true,
      },
    ];

    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={multipleTypingUsers}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    expect(screen.getByText('2 users are typing...')).toBeInTheDocument();
  });

  it('displays username for messages from other users', () => {
    render(
      <ChatBox
        messages={mockMessages}
        currentUser={mockCurrentUser}
        typingUsers={[]}
        onDeleteMessage={mockDeleteMessage}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
