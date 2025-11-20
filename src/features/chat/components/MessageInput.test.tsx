import { render, screen, fireEvent } from '@testing-library/react';
import { MessageInput } from './MessageInput';

jest.mock('@/shared/hooks', () => ({
  useTypingIndicator: jest.fn(() => ({
    triggerTyping: jest.fn(),
    stopTyping: jest.fn(),
  })),
}));

describe('MessageInput', () => {
  const mockOnSendMessage = jest.fn();
  const mockOnTypingChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message input with textarea', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    expect(
      screen.getByPlaceholderText(/Type your message.../i)
    ).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('updates message state when typing', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(textarea).toHaveValue('Hello world');
  });

  it('calls onSendMessage when send button is clicked', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const sendButton = screen.getByText('Send Message');
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message', undefined);
  });

  it('clears message after sending', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    const sendButton = screen.getByText('Send Message');
    fireEvent.click(sendButton);

    expect(textarea).toHaveValue('');
  });

  it('disables send button when message is empty', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const sendButton = screen.getByText('Send Message');
    expect(sendButton).toBeDisabled();
  });

  it('enables expiration settings when checkbox is checked', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const checkbox = screen.getByLabelText(/Auto-delete message after/i);
    fireEvent.click(checkbox);

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('sends message with Enter key', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message', undefined);
  });

  it('does not send message with Shift+Enter', () => {
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        onTypingChange={mockOnTypingChange}
      />
    );

    const textarea = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });
});
