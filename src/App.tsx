import { useState } from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Vite + React + shadcn/ui</h1>

      <div className="card flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setCount(count => count + 1)}>
            Count is {count}
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
          <Button
            variant="destructive"
            onClick={() => setCount(count => count - 1)}
          >
            Decrease
          </Button>
          <Button
            variant="outline"
            onClick={() => alert('Outline button clicked!')}
          >
            Outline
          </Button>
          <Button
            variant="ghost"
            onClick={() => alert('Ghost button clicked!')}
          >
            Ghost
          </Button>
        </div>

        <p className="text-muted-foreground">
          Testing shadcn/ui button variants
        </p>
      </div>
    </div>
  );
}

export default App;
