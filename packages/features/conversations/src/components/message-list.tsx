'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@kit/ui/scroll-area';
import { Skeleton } from '@kit/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Badge } from '@kit/ui/badge';
import { cn } from '@kit/ui/utils';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { useMessages, useRealtimeMessages } from '../hooks/use-messages';
import { useTypingIndicator } from '../hooks/use-realtime';
import type { MessageWithSender } from '../types';

interface MessageListProps {
  conversationId: string;
  currentUserId?: string;
  className?: string;
}

export function MessageList({ 
  conversationId, 
  currentUserId,
  className 
}: MessageListProps) {
  const { data: messages, isLoading } = useMessages(conversationId);
  const { typingUsers } = useTypingIndicator(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enable real-time message updates
  useRealtimeMessages(conversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className={cn('flex-1 p-4 space-y-4', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn('flex gap-3', i % 2 === 0 ? 'justify-end' : '')}>
            {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            <Skeleton className={cn('h-16 rounded-lg', i % 2 === 0 ? 'w-64' : 'w-80')} />
            {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center p-8', className)}>
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No messages yet</p>
          <p className="text-sm text-muted-foreground">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ScrollArea className={cn('flex-1', className)}>
      <div className="p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            <DateSeparator date={date} />
            <div className="space-y-3 mt-4">
              {dayMessages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isFromCurrentUser={message.sender_id === currentUserId}
                  showAvatar={shouldShowAvatar(dayMessages, index)}
                  showTimestamp={shouldShowTimestamp(dayMessages, index)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex gap-3 items-end">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {typingUsers[0].user_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-3 py-2 max-w-xs">
              <TypingAnimation />
              <p className="text-xs text-muted-foreground mt-1">
                {typingUsers.length === 1 
                  ? `${typingUsers[0].user_name} is typing...`
                  : `${typingUsers.length} people are typing...`
                }
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

interface MessageBubbleProps {
  message: MessageWithSender;
  isFromCurrentUser: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
}

function MessageBubble({ 
  message, 
  isFromCurrentUser, 
  showAvatar, 
  showTimestamp 
}: MessageBubbleProps) {
  const isPrivate = message.private;
  const isActivity = message.message_type === 'activity';

  if (isActivity) {
    return (
      <div className="flex justify-center">
        <div className="bg-muted rounded-full px-3 py-1 text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 items-end', isFromCurrentUser && 'justify-end')}>
      {!isFromCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="text-xs">
            {getSenderInitials(message)}
          </AvatarFallback>
        </Avatar>
      )}
      
      {!isFromCurrentUser && !showAvatar && (
        <div className="w-8" />
      )}

      <div className={cn('flex flex-col', isFromCurrentUser && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-3 py-2 max-w-xs lg:max-w-md break-words',
            isFromCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground',
            isPrivate && 'border-2 border-yellow-500 border-dashed'
          )}
        >
          {isPrivate && (
            <Badge variant="outline" className="text-xs mb-2">
              Private Note
            </Badge>
          )}
          
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index} className="text-xs opacity-75">
                  📎 {attachment.fallback_title || 'Attachment'}
                </div>
              ))}
            </div>
          )}
        </div>

        {showTimestamp && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.created_at), 'HH:mm')}
            </span>
            {isFromCurrentUser && (
              <MessageStatus status={message.status} />
            )}
          </div>
        )}
      </div>

      {isFromCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="text-xs">
            {getSenderInitials(message)}
          </AvatarFallback>
        </Avatar>
      )}
      
      {isFromCurrentUser && !showAvatar && (
        <div className="w-8" />
      )}
    </div>
  );
}

function MessageStatus({ status }: { status: string }) {
  const statusIcons = {
    sent: <Clock className="h-3 w-3" />,
    delivered: <Check className="h-3 w-3" />,
    read: <CheckCheck className="h-3 w-3" />,
    failed: <AlertCircle className="h-3 w-3 text-destructive" />,
  };

  return (
    <span className="text-muted-foreground">
      {statusIcons[status as keyof typeof statusIcons] || statusIcons.sent}
    </span>
  );
}

function DateSeparator({ date }: { date: string }) {
  const messageDate = new Date(date);
  let displayDate: string;

  if (isToday(messageDate)) {
    displayDate = 'Today';
  } else if (isYesterday(messageDate)) {
    displayDate = 'Yesterday';
  } else {
    displayDate = format(messageDate, 'MMM d, yyyy');
  }

  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-muted" />
      <span className="text-xs text-muted-foreground bg-background px-2">
        {displayDate}
      </span>
      <hr className="flex-1 border-muted" />
    </div>
  );
}

function TypingAnimation() {
  return (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-current rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 200}ms`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
}

// Helper functions
function groupMessagesByDate(messages: MessageWithSender[]): Record<string, MessageWithSender[]> {
  return messages.reduce((groups, message) => {
    const date = format(new Date(message.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, MessageWithSender[]>);
}

function shouldShowAvatar(messages: MessageWithSender[], index: number): boolean {
  if (index === messages.length - 1) return true;
  
  const current = messages[index];
  const next = messages[index + 1];
  
  return current.sender_id !== next.sender_id;
}

function shouldShowTimestamp(messages: MessageWithSender[], index: number): boolean {
  if (index === messages.length - 1) return true;
  
  const current = messages[index];
  const next = messages[index + 1];
  
  const currentTime = new Date(current.created_at);
  const nextTime = new Date(next.created_at);
  
  // Show timestamp if messages are more than 5 minutes apart
  return (nextTime.getTime() - currentTime.getTime()) > 5 * 60 * 1000;
}

function getSenderInitials(message: MessageWithSender): string {
  if (message.sender_type === 'User' && message.sender) {
    return message.sender.name?.charAt(0).toUpperCase() || 'U';
  }
  
  if (message.sender_type === 'Contact' && message.sender) {
    return message.sender.name?.charAt(0).toUpperCase() || 
           message.sender.email?.charAt(0).toUpperCase() || 'C';
  }
  
  return message.sender_type?.charAt(0) || 'M';
}