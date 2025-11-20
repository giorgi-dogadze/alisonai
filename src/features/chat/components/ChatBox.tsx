import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Message, User } from '@/types/collaboration';
import { MessageSquare, Trash2, Clock } from 'lucide-react';
import {
  isOwnMessage,
  formatTime,
  getExpirationCountdown,
} from '@/shared/utils';
import { useCurrentTime } from '@/shared/hooks';
import { MESSAGE_MAX_WIDTH_PERCENTAGE } from '@/shared';

interface ChatBoxProps {
  messages: Message[];
  currentUser: User;
  typingUsers: User[];
  onDeleteMessage: (messageId: string) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  currentUser,
  typingUsers,
  onDeleteMessage,
}) => {
  const currentTime = useCurrentTime();

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-4 scrollbar-gutter-stable">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(message => {
                const isOwn = isOwnMessage(message.userId, currentUser.id);

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[${MESSAGE_MAX_WIDTH_PERCENTAGE}%] space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}
                    >
                      {!isOwn && (
                        <span className="text-xs font-medium text-muted-foreground px-1">
                          {message.username}
                        </span>
                      )}

                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                      </div>

                      <div className="flex items-center gap-2 px-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.expiresAt && (
                          <span className="text-xs text-orange-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {getExpirationCountdown(
                              message.expiresAt,
                              currentTime
                            )}
                          </span>
                        )}
                        {isOwn && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 hover:text-destructive"
                            onClick={() => onDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {typingUsers.length === 1
                        ? `${typingUsers[0].name} is typing...`
                        : `${typingUsers.length} users are typing...`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
