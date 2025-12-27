import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function UserIdSetup() {
  const { setUserId } = useAuth();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserId(inputValue.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome to AI Chat</h1>
            <p className="text-muted-foreground">
              Enter your user ID to get started
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your user ID"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full"
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={!inputValue.trim()}>
              Continue
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

