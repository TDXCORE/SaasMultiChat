'use client';

import { Suspense } from 'react';
import { useUser } from '@kit/supabase/hooks/use-user';
import { ConversationView } from '@kit/conversations';
import { LoadingSpinner } from '@kit/ui/loading-spinner';
import { Card } from '@kit/ui/card';

export function ConversationsDashboard() {
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

  return (
    <div className="h-full">
      <Suspense 
        fallback={
          <Card className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </Card>
        }
      >
        <ConversationView
          accountId={accountId}
          currentUserId={user.data.id}
          currentUserName={user.data.email || 'User'}
          className="h-full"
        />
      </Suspense>
    </div>
  );
}