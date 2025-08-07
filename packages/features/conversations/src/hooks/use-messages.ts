import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@kit/supabase/client';
import { useEffect } from 'react';
import type { 
  MessageWithSender, 
  CreateMessagePayload 
} from '../types';

export function useMessages(conversationId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          attachments(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as MessageWithSender[];
    },
    enabled: !!conversationId,
    staleTime: 0, // Always fresh for real-time updates
  });
}

export function useCreateMessage() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: CreateMessagePayload) => {
      // First get conversation details for account_id and inbox_id
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('account_id, inbox_id, status')
        .eq('id', payload.conversation_id)
        .single();

      if (convError) throw convError;
      
      // Auto-reopen resolved conversations on new message
      if (conversation.status === 'resolved' && payload.message_type === 'incoming') {
        await supabase
          .from('conversations')
          .update({ status: 'open' })
          .eq('id', payload.conversation_id);
      }

      // Create the message
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          account_id: conversation.account_id,
          inbox_id: conversation.inbox_id,
          conversation_id: payload.conversation_id,
          content: payload.content,
          message_type: payload.message_type || 'outgoing',
          content_type: payload.content_type || 'text',
          private: payload.private || false,
          sender_type: payload.sender_type || 'User',
          // Note: sender_id should be set based on auth context
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_activity_at
      await supabase
        .from('conversations')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', payload.conversation_id);

      return message;
    },
    onSuccess: (data) => {
      // Add message to cache
      queryClient.setQueryData(
        ['messages', data.conversation_id],
        (old: MessageWithSender[] = []) => [...old, data as MessageWithSender]
      );
      
      // Update conversations list to reflect new activity
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
    },
  });
}

export function useRealtimeMessages(conversationId: string) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageWithSender;
          
          queryClient.setQueryData(
            ['messages', conversationId],
            (old: MessageWithSender[] = []) => {
              // Check if message already exists to avoid duplicates
              const exists = old.some(msg => msg.id === newMessage.id);
              if (exists) return old;
              return [...old, newMessage];
            }
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as MessageWithSender;
          
          queryClient.setQueryData(
            ['messages', conversationId],
            (old: MessageWithSender[] = []) => 
              old.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase, queryClient]);
}

export function useMarkAsRead() {
  const supabase = useSupabaseClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      userId 
    }: { 
      conversationId: string; 
      userId: string; 
    }) => {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          agent_last_seen_at: new Date().toISOString() 
        })
        .eq('id', conversationId);

      if (error) throw error;
    },
  });
}