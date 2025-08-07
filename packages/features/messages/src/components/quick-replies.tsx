'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { ScrollArea } from '@kit/ui/scroll-area';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@kit/ui/popover';
import { cn } from '@kit/ui/utils';
import { Zap, Search } from 'lucide-react';
import { Input } from '@kit/ui/input';
import { useQuickReplies } from '../hooks/use-message-templates';
import type { QuickReply } from '../types';

interface QuickRepliesProps {
  accountId: string;
  onReplySelect: (content: string) => void;
  className?: string;
}

export function QuickReplies({
  accountId,
  onReplySelect,
  className
}: QuickRepliesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: replies = [], isLoading } = useQuickReplies(accountId);

  const filteredReplies = replies.filter(reply =>
    reply.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reply.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reply.shortcut && reply.shortcut.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReplySelect = (reply: QuickReply) => {
    onReplySelect(reply.content);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('', className)}>
          <Zap className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Replies
          </h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search replies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>
        
        <ScrollArea className="max-h-64">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filteredReplies.length > 0 ? (
            <div className="p-1">
              {filteredReplies.map((reply) => (
                <QuickReplyItem
                  key={reply.id}
                  reply={reply}
                  onSelect={handleReplySelect}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No quick replies found</p>
              {searchTerm && (
                <p className="text-xs">Try different search terms</p>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface QuickReplyItemProps {
  reply: QuickReply;
  onSelect: (reply: QuickReply) => void;
}

function QuickReplyItem({ reply, onSelect }: QuickReplyItemProps) {
  return (
    <button
      onClick={() => onSelect(reply)}
      className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm">{reply.title}</span>
        {reply.shortcut && (
          <Badge variant="outline" className="text-xs">
            {reply.shortcut}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {reply.content}
      </p>
    </button>
  );
}

interface ShortcutIndicatorProps {
  shortcut: string;
  className?: string;
}

export function ShortcutIndicator({ shortcut, className }: ShortcutIndicatorProps) {
  return (
    <Badge variant="secondary" className={cn('text-xs font-mono', className)}>
      {shortcut}
    </Badge>
  );
}

export function useQuickReplyShortcuts(
  accountId: string,
  onReplySelect: (content: string) => void
) {
  const { data: replies = [] } = useQuickReplies(accountId);

  const handleShortcut = (text: string): boolean => {
    // Check if text starts with a shortcut
    const matchingReply = replies.find(reply => 
      reply.shortcut && text.startsWith(reply.shortcut + ' ')
    );

    if (matchingReply) {
      onReplySelect(matchingReply.content);
      return true;
    }

    return false;
  };

  const getShortcutSuggestions = (text: string): QuickReply[] => {
    if (!text.startsWith('/')) return [];
    
    return replies.filter(reply => 
      reply.shortcut && 
      reply.shortcut.toLowerCase().startsWith(text.toLowerCase())
    );
  };

  return {
    handleShortcut,
    getShortcutSuggestions,
    availableShortcuts: replies.filter(reply => reply.shortcut)
  };
}