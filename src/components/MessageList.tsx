import type { Message } from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { TypingIndicator } from './TypingIndicator';
import ReactMarkdown from 'react-markdown';

interface MessageListProps {
  messages: Message[];
  isWaitingForResponse?: boolean;
}

export function MessageList({ messages, isWaitingForResponse = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForResponse]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
              <div className="text-center space-y-2">
                <Bot className="h-12 w-12 mx-auto opacity-50" />
                <p>Start a conversation by sending a message</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-4',
                      isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isUser && (
                      <Avatar className="h-9 w-9 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-purple-100 text-purple-700 border border-purple-200">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'rounded-lg max-w-[80%]',
                        isUser
                          ? 'bg-white text-foreground border border-purple-100 shadow-sm px-4 py-3'
                          : 'bg-purple-50 text-foreground border border-purple-200 shadow-sm px-5 py-4'
                      )}
                    >
                      {isUser ? (
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {message.content}
                        </p>
                      ) : (
                        <div className="text-sm prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="ml-2">{children}</li>,
                              code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                  <code className="bg-white text-purple-700 px-1.5 py-0.5 rounded text-xs font-mono border border-purple-200">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="block bg-white text-purple-900 p-2 rounded text-xs font-mono overflow-x-auto border border-purple-200">
                                    {children}
                                  </code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="bg-white p-2 rounded mb-2 overflow-x-auto border border-purple-200">
                                  {children}
                                </pre>
                              ),
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-purple-300 pl-3 italic my-2">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <Avatar className="h-9 w-9 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-white border border-purple-200 text-purple-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
              {isWaitingForResponse && <TypingIndicator />}
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

