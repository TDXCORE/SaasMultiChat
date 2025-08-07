'use client';

import { useState } from 'react';
import { ScrollArea } from '@kit/ui/scroll-area';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Skeleton } from '@kit/ui/skeleton';
import { cn } from '@kit/ui/utils';
import { formatDistanceToNow } from 'date-fns';
import { Search, Filter, MoreHorizontal, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useContacts } from '../hooks/use-contacts';
import type { ContactWithDetails, ContactFilters } from '../types';

interface ContactListProps {
  accountId: string;
  selectedContactId?: string;
  onContactSelect: (contact: ContactWithDetails) => void;
  className?: string;
}

export function ContactList({
  accountId,
  selectedContactId,
  onContactSelect,
  className
}: ContactListProps) {
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    limit: 25
  });

  const { data, isLoading, isError } = useContacts(accountId, filters);

  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <ContactFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1 space-y-2 p-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex flex-col h-full items-center justify-center p-8', className)}>
        <p className="text-muted-foreground">Failed to load contacts</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <ContactFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {data?.contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContactId === contact.id}
              onClick={() => onContactSelect(contact)}
            />
          ))}
          
          {data?.contacts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">No contacts found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or create a new contact
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

interface ContactFiltersProps {
  filters: ContactFilters;
  onFilterChange: (key: keyof ContactFilters, value: any) => void;
}

function ContactFilters({ filters, onFilterChange }: ContactFiltersProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={filters.sort_by || 'created_at'}
          onValueChange={(value) => onFilterChange('sort_by', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="created_at">Created Date</SelectItem>
            <SelectItem value="last_activity_at">Last Activity</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.source || 'all'}
          onValueChange={(value) => onFilterChange('source', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="import">Import</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="widget">Widget</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface ContactItemProps {
  contact: ContactWithDetails;
  isSelected: boolean;
  onClick: () => void;
}

function ContactItem({ contact, isSelected, onClick }: ContactItemProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-md cursor-pointer border transition-colors hover:bg-accent',
        isSelected && 'bg-accent border-primary'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar_url} />
          <AvatarFallback>
            {contact.name?.charAt(0).toUpperCase() || 
             contact.email?.charAt(0).toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-sm truncate">
              {contact.name || 'Anonymous'}
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-1 text-xs text-muted-foreground">
            {contact.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone_number && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{contact.phone_number}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {contact.conversations_count && contact.conversations_count > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  <MessageSquare className="h-2 w-2 mr-1" />
                  {contact.conversations_count}
                </Badge>
              )}
              {contact.blocked && (
                <Badge variant="destructive" className="text-xs h-5">
                  Blocked
                </Badge>
              )}
              {contact.source && contact.source !== 'manual' && (
                <Badge variant="outline" className="text-xs h-5">
                  {contact.source}
                </Badge>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(contact.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}