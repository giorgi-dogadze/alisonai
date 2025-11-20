import { useState, useEffect, useCallback } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import type { Message } from '@/types/collaboration';
import { generateMessageId, isMessageExpired } from '@/shared/utils';
import { BROADCAST_CONSTANTS } from '@/shared/constants';

interface UseCollaborativeMessagesProps {
  sourceName: string;
  userId: string;
  username: string;
}

interface UseCollaborativeMessagesReturn {
  messages: Message[];
  sendMessage: (content: string, expiresIn?: number) => void;
  deleteMessage: (messageId: string) => void;
}

export const useCollaborativeMessages = ({
  sourceName,
  userId,
  username,
}: UseCollaborativeMessagesProps): UseCollaborativeMessagesReturn => {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const { messages: chatMessages, postMessage: postChatMessage } =
    useBroadcastChannel(BROADCAST_CONSTANTS.CHANNELS.MESSAGES, {
      sourceName,
      namespace: BROADCAST_CONSTANTS.NAMESPACE,
      keepLatestMessage: false,
    });

  useEffect(() => {
    const latestMessage = chatMessages[chatMessages.length - 1];

    if (latestMessage?.type === BROADCAST_CONSTANTS.ACTIONS.SEND) {
      if (latestMessage?.message) {
        const msg = latestMessage.message as Message;

        // Skip if message already expired
        if (isMessageExpired(msg.expiresAt)) {
          return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // Set up auto-deletion for received messages with expiration
        if (msg.expiresAt) {
          const timeUntilExpiration = msg.expiresAt - Date.now();
          if (timeUntilExpiration > 0) {
            setTimeout(() => {
              setLocalMessages(prev => prev.filter(m => m.id !== msg.id));
            }, timeUntilExpiration);
          }
        }
      }
    } else if (latestMessage?.type === BROADCAST_CONSTANTS.ACTIONS.DELETE) {
      if (latestMessage?.message) {
        const { messageId } = latestMessage.message as { messageId: string };
        setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
      }
    }
  }, [chatMessages]);

  const sendMessage = useCallback(
    (content: string, expiresIn?: number) => {
      const timestamp = Date.now();
      const message: Message = {
        id: generateMessageId(),
        userId,
        username,
        content,
        timestamp,
        expiresAt: expiresIn ? timestamp + expiresIn : undefined,
      };

      setLocalMessages(prev => [...prev, message]);
      postChatMessage(BROADCAST_CONSTANTS.ACTIONS.SEND, message);

      if (expiresIn) {
        setTimeout(() => {
          setLocalMessages(prev => prev.filter(msg => msg.id !== message.id));
          postChatMessage(BROADCAST_CONSTANTS.ACTIONS.DELETE, {
            messageId: message.id,
          });
        }, expiresIn);
      }
    },
    [userId, username, postChatMessage]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      const message = localMessages.find(msg => msg.id === messageId);
      if (!message || message.userId !== userId) return;

      setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
      postChatMessage(BROADCAST_CONSTANTS.ACTIONS.DELETE, { messageId });
    },
    [localMessages, userId, postChatMessage]
  );

  return {
    messages: localMessages,
    sendMessage,
    deleteMessage,
  };
};
