'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@kit/ui/button';
import { Textarea } from '@kit/ui/textarea';
import { cn } from '@kit/ui/utils';
import { Send, Paperclip, Smile, Hash, AtSign } from 'lucide-react';
import { useCreateMessage } from '../hooks/use-messages';
import { useTypingIndicator } from '../hooks/use-realtime';

interface MessageInputProps {
  conversationId: string;
  currentUserId?: string;
  currentUserName?: string;
  onSendMessage?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MessageInput({
  conversationId,
  currentUserId,
  currentUserName,
  onSendMessage,
  placeholder = "Type your message...",
  disabled = false,
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { mutate: createMessage, isPending } = useCreateMessage();
  const { startTyping, stopTyping } = useTypingIndicator(conversationId);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  // Handle typing indicators
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (message.trim() && currentUserId && currentUserName) {
      startTyping(currentUserId, currentUserName);
      
      typingTimeout = setTimeout(() => {
        stopTyping(currentUserId);
      }, 1000);
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      if (currentUserId && message.trim()) {
        stopTyping(currentUserId);
      }
    };
  }, [message, currentUserId, currentUserName, startTyping, stopTyping]);

  const handleSubmit = () => {
    const content = message.trim();
    if (!content || isPending || disabled) return;

    const messagePayload = {
      conversation_id: conversationId,
      content,
      message_type: 'outgoing' as const,
      content_type: 'text' as const,
      private: isPrivateNote,
      sender_type: 'User' as const,
    };

    createMessage(messagePayload, {
      onSuccess: () => {
        setMessage('');
        setIsPrivateNote(false);
        if (currentUserId) {
          stopTyping(currentUserId);
        }
        onSendMessage?.(content);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTogglePrivate = () => {
    setIsPrivateNote(!isPrivateNote);
  };

  return (
    <div className={cn('border-t bg-background p-4', className)}>
      {/* Private note indicator */}
      {isPrivateNote && (
        <div className="mb-2 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <Hash className="h-4 w-4" />
          <span>Private note - only visible to team members</span>
        </div>
      )}
      
      <div className="flex gap-2 items-end">
        {/* Message input area */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isPrivateNote ? "Add a private note..." : placeholder}
            disabled={disabled || isPending}
            className={cn(
              'min-h-[44px] max-h-[120px] resize-none pr-12',
              isPrivateNote && 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20'
            )}
            rows={1}
          />
          
          {/* Emoji picker button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            disabled={disabled || isPending}
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 p-0"
            disabled={disabled || isPending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Private note toggle */}
          <Button
            variant={isPrivateNote ? "default" : "ghost"}
            size="sm"
            className="h-11 w-11 p-0"
            onClick={handleTogglePrivate}
            disabled={disabled || isPending}
            title="Toggle private note"
          >
            <Hash className="h-4 w-4" />
          </Button>

          {/* Send button */}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isPending || disabled}
            className="h-11 w-11 p-0"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick actions / shortcuts */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>Enter to send, Shift+Enter for new line</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <AtSign className="h-3 w-3 mr-1" />
            Mention
          </Button>
        </div>
      </div>
    </div>
  );
}