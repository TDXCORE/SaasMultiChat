'use client';

import { useState, Suspense } from 'react';
import { useUser } from '@kit/supabase/hooks/use-user';
import { ContactList, ContactDetails } from '@kit/contacts';
import { LoadingSpinner } from '@kit/ui/loading-spinner';
import { Card } from '@kit/ui/card';
import { cn } from '@kit/ui/utils';
import type { ContactWithDetails } from '@kit/contacts';

export function ContactsDashboard() {
  const [selectedContactId, setSelectedContactId] = useState<string>();
  const user = useUser();

  if (!user.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // For now, we'll use a hardcoded account ID
  // In a real app, this would come from the user's current organization/account context
  const accountId = 'default-account';

  const handleContactSelect = (contact: ContactWithDetails) => {
    setSelectedContactId(contact.id);
  };

  const handleContactDeleted = () => {
    setSelectedContactId(undefined);
  };

  return (
    <div className="flex h-full">
      {/* Contacts List Sidebar */}
      <div className="w-80 border-r bg-background flex-shrink-0">
        <Suspense 
          fallback={
            <div className="p-4">
              <LoadingSpinner />
            </div>
          }
        >
          <ContactList
            accountId={accountId}
            selectedContactId={selectedContactId}
            onContactSelect={handleContactSelect}
          />
        </Suspense>
      </div>

      {/* Main Contact Details Area */}
      <div className="flex-1 flex flex-col">
        {selectedContactId ? (
          <Suspense 
            fallback={
              <Card className="h-full flex items-center justify-center">
                <LoadingSpinner />
              </Card>
            }
          >
            <ContactDetails 
              contactId={selectedContactId}
              onContactDeleted={handleContactDeleted}
              className="h-full"
            />
          </Suspense>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No contact selected</h3>
              <p className="text-muted-foreground max-w-sm">
                Select a contact from the sidebar to view their details and conversation history.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}