import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-9 w-9 shrink-0 shadow-sm">
        <AvatarFallback className="bg-purple-100 text-purple-700 border border-purple-200">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="rounded-lg px-5 py-4 bg-purple-50 text-foreground border border-purple-200 shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}

