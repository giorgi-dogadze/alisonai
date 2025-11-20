import type { UseCollaborativeSession } from '@/types/collaboration';
import { useCurrentUser } from '@/features/user-presence';
import { useCollaborativeUsers } from '@/features/user-presence';
import { useCollaborativeMessages } from '@/features/chat';
import { useCollaborativeCounter } from '@/features/counter';

export const useCollaborativeSession = (): UseCollaborativeSession => {
  const { currentUser, userId, sourceName, updateUsername, setTyping } =
    useCurrentUser();

  const { users, postTypingStatus } = useCollaborativeUsers({ sourceName });

  const { messages, sendMessage, deleteMessage } = useCollaborativeMessages({
    sourceName,
    userId,
    username: currentUser.name,
  });

  const { counter, incrementCounter, decrementCounter } =
    useCollaborativeCounter({ sourceName });

  // Mark typing status (update local and broadcast)
  const markTyping = (isTyping: boolean) => {
    setTyping(isTyping);
    postTypingStatus(userId, isTyping);
  };

  const currentDate = new Date();

  return {
    // State
    currentUser,
    users,
    messages,
    counter: {
      value: counter,
      timestamp: currentDate.getTime(),
      lastActionBy: currentUser.name,
      lastActionTimestamp: currentDate.getTime(),
    },
    isInitialized: true,

    // Actions
    updateUsername,
    sendMessage,
    deleteMessage,
    incrementCounter,
    decrementCounter,
    markTyping,
  };
};
