'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Badge } from '@kit/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@kit/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
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
  Edit2, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MessageSquare,
  Ban,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useContact, useUpdateContact, useDeleteContact } from '../hooks/use-contacts';
import type { ContactWithDetails } from '../types';

interface ContactDetailsProps {
  contactId: string;
  className?: string;
  onContactDeleted?: () => void;
}

export function ContactDetails({ 
  contactId, 
  className,
  onContactDeleted 
}: ContactDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ContactWithDetails>>({});
  
  const { data: contact, isLoading } = useContact(contactId);
  const { mutate: updateContact, isPending: isUpdating } = useUpdateContact();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  if (isLoading) {
    return (
      <div className={cn('p-6', className)}>
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full mb-4" />
          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className={cn('p-6 text-center', className)}>
        <p className="text-muted-foreground">Contact not found</p>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({
      name: contact.name,
      email: contact.email,
      phone_number: contact.phone_number,
      location: contact.location,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateContact(
      {
        contactId: contact.id,
        payload: editForm
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditForm({});
        }
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      deleteContact(contact.id, {
        onSuccess: () => {
          onContactDeleted?.();
        }
      });
    }
  };

  return (
    <div className={cn('h-full overflow-auto', className)}>
      {/* Header */}
      <div className="border-b p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={contact.avatar_url} />
              <AvatarFallback className="text-lg">
                {contact.name?.charAt(0).toUpperCase() || 
                 contact.email?.charAt(0).toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contact name"
                    className="font-semibold text-lg"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-semibold">
                    {contact.name || 'Anonymous Contact'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {contact.blocked && (
                      <Badge variant="destructive" className="text-xs">
                        Blocked
                      </Badge>
                    )}
                    {contact.source && (
                      <Badge variant="outline" className="text-xs">
                        {contact.source}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Ban className="h-4 w-4 mr-2" />
                      {contact.blocked ? 'Unblock' : 'Block'} Contact
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">
                  <p className="font-medium">
                    {contact.email || 'No email provided'}
                  </p>
                  {contact.email && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => window.open(`mailto:${contact.email}`)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Send email
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={editForm.phone_number || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Phone number"
                  className="flex-1"
                />
              ) : (
                <div className="flex-1">
                  <p className="font-medium">
                    {contact.phone_number || 'No phone provided'}
                  </p>
                  {contact.phone_number && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => window.open(`tel:${contact.phone_number}`)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {isEditing ? (
                <Input
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="flex-1"
                />
              ) : (
                <p className="font-medium">
                  {contact.location || 'No location provided'}
                </p>
              )}
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {format(new Date(contact.created_at), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{contact.conversations_count || 0}</p>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {contact.last_conversation_at 
                    ? formatDistanceToNow(new Date(contact.last_conversation_at), { addSuffix: true })
                    : 'Never'
                  }
                </p>
                <p className="text-sm text-muted-foreground">Last Activity</p>
              </div>
            </div>
            
            {contact.conversations && contact.conversations.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Recent Conversations</h4>
                {contact.conversations.slice(0, 3).map((conv: any) => (
                  <div key={conv.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="font-medium text-sm">{conv.inbox?.name}</p>
                      <p className="text-xs text-muted-foreground">{conv.status}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Attributes */}
        {contact.custom_attributes && Object.keys(contact.custom_attributes).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(contact.custom_attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}