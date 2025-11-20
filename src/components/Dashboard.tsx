import { useCollaborativeSession } from '@/features/collaboration';
import { UserPresence } from '@/features/user-presence';
import { SharedCounter } from '@/features/counter';
import { ChatBox, MessageInput } from '@/features/chat';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    users,
    messages,
    counter,
    isInitialized,
    updateUsername,
    sendMessage,
    deleteMessage,
    incrementCounter,
    decrementCounter,
    markTyping,
  } = useCollaborativeSession();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing collaboration...</p>
        </div>
      </div>
    );
  }

  // Filter out current user from the users list to show only other tabs
  const otherUsers = users.filter(user => user.id !== currentUser.id);

  // Get users who are currently typing (excluding current user)
  const typingUsers = otherUsers.filter(user => user.isTyping);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <div className="flex-none px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Cross-Tab Collaboration Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Open multiple tabs to see real-time synchronization in action
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 overflow-auto scrollbar-gutter-stable">
        <div className="max-w-7xl mx-auto h-full w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 h-full min-h-0">
            <div className="lg:col-span-1 flex flex-col min-h-0 min-w-0">
              <div className="flex-1 overflow-hidden">
                <UserPresence
                  currentUser={currentUser}
                  users={otherUsers}
                  onUpdateUsername={updateUsername}
                />
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6 min-h-0 min-w-0">
              <div className="flex-none">
                <SharedCounter
                  counter={counter}
                  onIncrement={incrementCounter}
                  onDecrement={decrementCounter}
                />
              </div>

              <div className="flex-1 flex flex-col gap-4 min-h-0 min-w-0 overflow-hidden">
                <div className="flex-1 min-h-0 min-w-0">
                  <ChatBox
                    messages={messages}
                    currentUser={currentUser}
                    typingUsers={typingUsers}
                    onDeleteMessage={deleteMessage}
                  />
                </div>
                <div className="flex-none min-w-0">
                  <MessageInput
                    onSendMessage={sendMessage}
                    onTypingChange={markTyping}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
