'use client';

import { useState } from 'react';
import { ScrollArea } from '@kit/ui/scroll-area';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Skeleton } from '@kit/ui/skeleton';
import { cn } from '@kit/ui/utils';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { useConversations } from '../hooks/use-conversations';
import type { ConversationWithDetails, ConversationFilters } from '../types';

interface ConversationListProps {
  accountId: string;
  selectedConversationId?: string;
  onConversationSelect: (conversation: ConversationWithDetails) => void;
  className?: string;
}

export function ConversationList({
  accountId,
  selectedConversationId,
  onConversationSelect,
  className
}: ConversationListProps) {
  const [filters, setFilters] = useState<ConversationFilters>({
    status: 'all',
    assignee_id: 'all',
    search: '',
    sort_by: 'last_activity_at',
    sort_order: 'desc',
    limit: 25
  });

  const { data, isLoading, isError } = useConversations(accountId, filters);

  const handleFilterChange = (key: keyof ConversationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <ConversationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1 space-y-2 p-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex flex-col h-full items-center justify-center p-8', className)}>
        <p className="text-muted-foreground">Failed to load conversations</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <ConversationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {data?.conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation)}
            />
          ))}
          
          {data?.conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-muted-foreground mb-2">No conversations found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or create a new conversation
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {data && data.totalPages > 1 && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {data.page} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.page <= 1}
                onClick={() => handleFilterChange('page', data.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= data.totalPages}
                onClick={() => handleFilterChange('page', data.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ConversationFiltersProps {
  filters: ConversationFilters;
  onFilterChange: (key: keyof ConversationFilters, value: any) => void;
}

function ConversationFilters({ filters, onFilterChange }: ConversationFiltersProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="snoozed">Snoozed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.assignee_id || 'all'}
          onValueChange={(value) => onFilterChange('assignee_id', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="me">Assigned to me</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: ConversationWithDetails;
  isSelected: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const statusColors = {
    open: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    resolved: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    snoozed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <div
      className={cn(
        'p-3 rounded-md cursor-pointer border transition-colors hover:bg-accent',
        isSelected && 'bg-accent border-primary'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-medium text-sm truncate">
            {conversation.contact?.name || conversation.contact?.email || 'Anonymous'}
          </span>
          <Badge 
            variant="secondary" 
            className={cn('text-xs', statusColors[conversation.status])}
          >
            {conversation.status}
          </Badge>
          {conversation.priority && (
            <Badge 
              variant="outline" 
              className={cn('text-xs', priorityColors[conversation.priority])}
            >
              {conversation.priority}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {conversation.last_message?.content || 'No messages yet'}
      </p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="truncate">
          {conversation.inbox.name}
        </span>
        <span>
          {formatDistanceToNow(new Date(conversation.last_activity_at), {
            addSuffix: true,
          })}
        </span>
      </div>
      
      {conversation.assignee && (
        <div className="flex items-center gap-1 mt-2">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
            {conversation.assignee.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {conversation.assignee.name}
          </span>
        </div>
      )}
      
      {conversation.unread_count && conversation.unread_count > 0 && (
        <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-1 h-5">
          {conversation.unread_count}
        </Badge>
      )}
    </div>
  );
}