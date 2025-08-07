// Placeholder hook to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { 
  ConversationWithDetails, 
  UpdateConversationPayload,
  ConversationStatus 
} from '../types';

export function useConversations(accountId: string) {
  return useQuery({
    queryKey: ['conversations', accountId],
    queryFn: async () => {
      // Placeholder implementation
      return [] as ConversationWithDetails[];
    },
    enabled: !!accountId,
    staleTime: 30000, // 30 seconds
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      // Placeholder implementation
      return null as ConversationWithDetails | null;
    },
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      // Placeholder implementation
      return {
        id: 'placeholder',
        account_id: payload.account_id,
        inbox_id: payload.inbox_id,
        contact_id: payload.contact_id,
        status: 'open' as ConversationStatus,
        created_at: new Date().toISOString(),
      } as any;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations', data.account_id] 
      });
    },
  });
}

export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      status 
    }: { 
      conversationId: string; 
      status: ConversationStatus; 
    }) => {
      // Placeholder implementation
      console.log('Update conversation status placeholder:', { conversationId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    },
  });
}

export function useAssignConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      assigneeId 
    }: { 
      conversationId: string; 
      assigneeId: string | null; 
    }) => {
      // Placeholder implementation
      console.log('Assign conversation placeholder:', { conversationId, assigneeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    },
  });
}

export function useRealtimeConversations(accountId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accountId) return;

    // Placeholder implementation - no real-time updates
    console.log('Realtime conversations placeholder for account:', accountId);

    return () => {
      // Cleanup placeholder
    };
  }, [accountId, queryClient]);
}
