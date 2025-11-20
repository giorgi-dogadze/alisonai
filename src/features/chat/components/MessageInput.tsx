import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send } from 'lucide-react';
import { useTypingIndicator } from '@/shared/hooks';
import { convertToMilliseconds } from '@/shared/utils';
import {
  DEFAULT_EXPIRATION_UNIT,
  DEFAULT_EXPIRATION_VALUE,
  type TimeUnit,
} from '@/shared';

interface MessageInputProps {
  onSendMessage: (content: string, expiresIn?: number) => void;
  onTypingChange: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTypingChange,
}) => {
  const [message, setMessage] = useState('');
  const [expirationValue, setExpirationValue] = useState(
    DEFAULT_EXPIRATION_VALUE
  );
  const [expirationUnit, setExpirationUnit] = useState<TimeUnit>(
    DEFAULT_EXPIRATION_UNIT
  );
  const [enableExpiration, setEnableExpiration] = useState(false);

  const { triggerTyping, stopTyping } = useTypingIndicator({ onTypingChange });

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (value.trim().length > 0) {
      triggerTyping();
    } else {
      stopTyping();
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const expiresIn = enableExpiration
      ? convertToMilliseconds(expirationValue, expirationUnit)
      : undefined;

    onSendMessage(trimmedMessage, expiresIn);

    // Reset form
    setMessage('');
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardContent className="pt-6 space-y-4 w-full max-w-full box-border">
        <div className="space-y-2 w-full">
          <Textarea
            placeholder="Type your message... (Shift+Enter for new line)"
            value={message}
            onChange={e => handleMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="resize-none w-full"
            style={{ maxWidth: '755px' }}
          />
        </div>

        <div className="space-y-3 w-full">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable-expiration"
              checked={enableExpiration}
              onChange={e => setEnableExpiration(e.target.checked)}
              className="rounded border-input flex-shrink-0"
            />
            <label
              htmlFor="enable-expiration"
              className="text-sm font-medium cursor-pointer flex-shrink-0"
            >
              Auto-delete message after
            </label>
          </div>

          <div className="flex gap-2 h-10">
            <Input
              type="number"
              min="1"
              value={expirationValue}
              onChange={e => setExpirationValue(e.target.value)}
              placeholder="30"
              className="w-24 flex-shrink-0 max-w-[6rem]"
              disabled={!enableExpiration}
              style={{
                visibility: enableExpiration ? 'visible' : 'hidden',
              }}
            />
            <div
              className="w-32 flex-shrink-0 max-w-[8rem]"
              style={{
                visibility: enableExpiration ? 'visible' : 'hidden',
              }}
            >
              <Select
                value={expirationUnit}
                onValueChange={value => setExpirationUnit(value as TimeUnit)}
                disabled={!enableExpiration}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
};
