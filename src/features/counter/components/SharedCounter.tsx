import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CounterState } from '@/types/collaboration';
import { Plus, Minus, Activity } from 'lucide-react';
import { getRelativeTime } from '@/shared/utils';
import { useCurrentTime } from '@/shared/hooks';

interface SharedCounterProps {
  counter: CounterState;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const SharedCounter: React.FC<SharedCounterProps> = ({
  counter,
  onIncrement,
  onDecrement,
}) => {
  const currentTime = useCurrentTime();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Shared Counter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-5xl md:text-6xl font-bold tabular-nums text-primary mb-2">
            {counter.value}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Last updated by{' '}
            <span className="font-medium text-foreground">
              {counter.lastActionBy}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(currentTime, counter.lastActionTimestamp)}
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            size="default"
            variant="outline"
            onClick={onDecrement}
            className="w-28 h-10"
          >
            <Minus className="h-4 w-4 mr-2" />
            Decrement
          </Button>
          <Button size="default" onClick={onIncrement} className="w-28 h-10">
            <Plus className="h-4 w-4 mr-2" />
            Increment
          </Button>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-center text-muted-foreground">
            This counter is synchronized across all open tabs in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
