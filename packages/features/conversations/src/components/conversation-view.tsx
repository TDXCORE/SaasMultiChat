'use client';

import { useState } from 'react';
import { cn } from '@kit/ui/utils';
import { ConversationList } from './conversation-list';
import { ConversationHeader } from './conversation-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useConversation } from '../hooks/use-conversations';
import { useRealtimeConversations } from '../hooks/use-realtime';
import type { ConversationWithDetails } from '../types';

interface ConversationViewProps {
  accountId: string;
  currentUserId?: string;
  currentUserName?: string;
  className?: string;
}

export function ConversationView({
  accountId,
  currentUserId,
  currentUserName,
  className
}: ConversationViewProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  
  // Enable real-time updates for conversations
  useRealtimeConversations(accountId);
  
  // Get selected conversation details
  const { data: selectedConversation } = useConversation(
    selectedConversationId || ''
  );

  const handleConversationSelect = (conversation: ConversationWithDetails) => {
    setSelectedConversationId(conversation.id);
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Conversation List Sidebar */}
      <div className="w-80 border-r bg-background flex-shrink-0">
        <ConversationList
          accountId={accountId}
          selectedConversationId={selectedConversationId}
          onConversationSelect={handleConversationSelect}
        />
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <ConversationHeader 
              conversation={selectedConversation}
            />
            
            {/* Messages Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <MessageList 
                conversationId={selectedConversation.id}
                currentUserId={currentUserId}
                className="flex-1"
              />
              
              {/* Message Input */}
              <MessageInput 
                conversationId={selectedConversation.id}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
              />
            </div>
          </>
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-sm">
                Select a conversation from the sidebar to start viewing and responding to messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}