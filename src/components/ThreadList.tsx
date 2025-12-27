import type { Thread } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreadListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
}

export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  onCreateThread,
}: ThreadListProps) {
  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      <div className="p-4 border-b">
        <Button
          onClick={onCreateThread}
          className="w-full justify-start gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New Thread
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {threads.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No threads yet. Create a new one to get started!
            </div>
          ) : (
            threads.map((thread) => (
              <Button
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                variant={selectedThreadId === thread.id ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-auto py-3 px-3',
                  selectedThreadId === thread.id && 'bg-accent'
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate text-left flex-1">
                  {thread.title || `Thread ${thread.id.slice(0, 8)}`}
                </span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

