'use client';

import { Button } from '@kit/ui/button';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Separator } from '@kit/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@kit/ui/dropdown-menu';
import { cn } from '@kit/ui/utils';
import { 
  MoreHorizontal, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Archive, 
  MessageSquare, 
  UserPlus,
  Ban,
  CheckCircle,
  AlertCircle,
  Pause
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useConversationUpdate } from '../hooks/use-conversations';
import type { ConversationWithDetails } from '../types';

interface ConversationHeaderProps {
  conversation: ConversationWithDetails;
  onClose?: () => void;
  className?: string;
}

export function ConversationHeader({ 
  conversation, 
  onClose, 
  className 
}: ConversationHeaderProps) {
  const { mutate: updateConversation } = useConversationUpdate();

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

  const handleStatusChange = (status: string) => {
    updateConversation({
      id: conversation.id,
      updates: { status }
    });
  };

  const handleAssign = () => {
    // TODO: Implement assignment dialog
    console.log('Assign conversation');
  };

  return (
    <div className={cn('border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      {/* Main header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Contact avatar and info */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.contact?.avatar_url} />
            <AvatarFallback>
              {conversation.contact?.name?.charAt(0).toUpperCase() || 
               conversation.contact?.email?.charAt(0).toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold truncate">
                {conversation.contact?.name || conversation.contact?.email || 'Anonymous'}
              </h2>
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
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {conversation.inbox.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(conversation.last_activity_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Quick status actions */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant={conversation.status === 'open' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleStatusChange('open')}
              className="h-8"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              Open
            </Button>
            <Button
              variant={conversation.status === 'resolved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleStatusChange('resolved')}
              className="h-8"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Resolve
            </Button>
            <Button
              variant={conversation.status === 'snoozed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleStatusChange('snoozed')}
              className="h-8"
            >
              <Pause className="h-3 w-3 mr-1" />
              Snooze
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* More actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleAssign}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign to agent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Ban className="h-4 w-4 mr-2" />
                Block contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contact details bar */}
      {conversation.contact && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {conversation.contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {conversation.contact.email}
              </span>
            )}
            {conversation.contact.phone_number && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {conversation.contact.phone_number}
              </span>
            )}
            {conversation.contact.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {conversation.contact.location}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Assignment info */}
      {conversation.assignee && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Assigned to:</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                {conversation.assignee.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{conversation.assignee.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}