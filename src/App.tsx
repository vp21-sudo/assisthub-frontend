import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppSidebar } from './components/AppSidebar';
import { MessageList } from './components/MessageList';
import { MessageInput, type MessageInputRef } from './components/MessageInput';
import { api } from './services/api';
import type { Thread, Message } from './services/api';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './components/ui/popover';
import {
  SidebarProvider,
  SidebarTrigger,
} from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { User } from 'lucide-react';

function ChatApp() {
  const { userId, isLoading } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setIsLoadingThreads] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messageInputRef = useRef<MessageInputRef>(null);

  // Load thread ID from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const threadIdFromUrl = params.get('thread');
    if (threadIdFromUrl) {
      setSelectedThreadId(threadIdFromUrl);
    }
  }, []);

  // Load threads when userId is available
  useEffect(() => {
    if (userId) {
      loadThreads();
    }
  }, [userId]);

  // Load messages when thread is selected
  useEffect(() => {
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    } else {
      setMessages([]);
    }
  }, [selectedThreadId]);

  const loadThreads = async () => {
    if (!userId) return;
    setIsLoadingThreads(true);
    try {
      const response = await api.getThreads();
      setThreads(response.threads);
      
      // Check URL for thread ID first
      const params = new URLSearchParams(window.location.search);
      const threadIdFromUrl = params.get('thread');
      
      if (threadIdFromUrl && response.threads.some(t => t.id === threadIdFromUrl)) {
        setSelectedThreadId(threadIdFromUrl);
      } else if (!selectedThreadId && response.threads.length > 0) {
        // Auto-select first thread if none selected and no URL param
        setSelectedThreadId(response.threads[0].id);
      }
    } catch (error) {
      console.error('Failed to load threads:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load threads';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await api.getThreadMessages(threadId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCreateThread = async () => {
    if (!userId) return;
    try {
      const response = await api.createThread({});
      const newThread = response.thread;
      setThreads((prev) => [newThread, ...prev]);
      setSelectedThreadId(newThread.id);
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('thread', newThread.id);
      window.history.pushState({}, '', url);
    } catch (error) {
      console.error('Failed to create thread:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create thread';
      toast.error('Error', {
        description: errorMessage,
      });
    }
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('thread', threadId);
    window.history.pushState({}, '', url);
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await api.deleteThread(threadId);
      
      // Remove thread from list and handle selection
      setThreads((prev) => {
        const remainingThreads = prev.filter((t) => t.id !== threadId);
        
        // If deleted thread was selected
        if (selectedThreadId === threadId) {
          setSelectedThreadId(null);
          setMessages([]);
          const url = new URL(window.location.href);
          url.searchParams.delete('thread');
          window.history.pushState({}, '', url);
          
          // Auto-select first thread if available
          if (remainingThreads.length > 0) {
            setTimeout(() => {
              handleSelectThread(remainingThreads[0].id);
            }, 0);
          }
        }
        
        return remainingThreads;
      });
    } catch (error) {
      console.error('Failed to delete thread:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete thread';
      toast.error('Error', {
        description: errorMessage,
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedThreadId || !content.trim()) return;

    // Create optimistic user message
    const optimisticUserMessage: Message = {
      id: `temp-${Date.now()}`,
      threadId: selectedThreadId,
      role: 'user',
      content: content.trim(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, optimisticUserMessage]);
    setIsSendingMessage(true);

    try {
      const response = await api.sendMessage(selectedThreadId, { content: content.trim() });
      // Replace optimistic message with actual messages from server
      setMessages((prev) => {
        // Remove the optimistic message
        const withoutOptimistic = prev.filter((msg) => msg.id !== optimisticUserMessage.id);
        // Add the actual user message and AI response
        return [...withoutOptimistic, response.message, response.response];
      });
      // Refresh threads to update any metadata
      await loadThreads();
      // Focus input after response is received
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast.error('Error', {
        description: errorMessage,
      });
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticUserMessage.id));
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        threads={threads}
        selectedThreadId={selectedThreadId}
        onSelectThread={handleSelectThread}
        onCreateThread={handleCreateThread}
        onDeleteThread={handleDeleteThread}
      />
      <main className="flex flex-col h-screen w-full">
        {/* Header */}
        <div className="border-b bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="min-w-0 flex-1 max-w-[70%]">
              <h2 className="text-lg font-semibold truncate">
                {selectedThreadId
                  ? threads.find((t) => t.id === selectedThreadId)?.title ||
                    'Chat'
                  : 'Select a thread'}
              </h2>
              {selectedThreadId && (
                <p className="text-sm text-muted-foreground truncate">
                  Thread ID: {selectedThreadId.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className=" cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="end">
              <p className="text-sm font-medium">Anonymous user</p>
            </PopoverContent>
          </Popover>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden relative">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading messages...</div>
            </div>
          ) : (
            <MessageList messages={messages} isWaitingForResponse={isSendingMessage} />
          )}
        </div>

            {/* Input */}
            {selectedThreadId && (
              <MessageInput
                ref={messageInputRef}
                onSend={handleSendMessage}
                disabled={!selectedThreadId}
                isLoading={isSendingMessage}
              />
            )}
      </main>
    </SidebarProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatApp />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
