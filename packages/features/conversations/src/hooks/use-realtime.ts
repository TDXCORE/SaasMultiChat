import { useEffect, useState, useCallback } from 'react';
import { useSupabaseClient } from '@kit/supabase/client';
import type { 
  ConversationRealtimeEvent, 
  TypingIndicator 
} from '../types';

export function useRealtimeConversations(accountId: string) {
  const supabase = useSupabaseClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accountId) return;

    const channel = supabase
      .channel(`account:${accountId}:conversations`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `account_id=eq.${accountId}`,
        },
        (payload) => {
          const event: ConversationRealtimeEvent = {
            type: 'conversation_updated',
            conversation_id: payload.new?.id || payload.old?.id,
            account_id: accountId,
            data: payload.new || payload.old,
          };
          
          // Dispatch custom event for components to listen
          window.dispatchEvent(
            new CustomEvent('conversation-update', { detail: event })
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, supabase]);

  return { isConnected };
}

export function useTypingIndicator(conversationId: string) {
  const supabase = useSupabaseClient();
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  const startTyping = useCallback(
    (userId: string, userName: string) => {
      if (!conversationId || !userId) return;

      const channel = supabase.channel(`conversation:${conversationId}:typing`);
      
      channel.send({
        type: 'broadcast',
        event: 'typing_start',
        payload: {
          user_id: userId,
          user_name: userName,
          conversation_id: conversationId,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [conversationId, supabase]
  );

  const stopTyping = useCallback(
    (userId: string) => {
      if (!conversationId || !userId) return;

      const channel = supabase.channel(`conversation:${conversationId}:typing`);
      
      channel.send({
        type: 'broadcast',
        event: 'typing_stop',
        payload: {
          user_id: userId,
          conversation_id: conversationId,
          timestamp: new Date().toISOString(),
        },
      });
    },
    [conversationId, supabase]
  );

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation:${conversationId}:typing`)
      .on('broadcast', { event: 'typing_start' }, (payload) => {
        const typingData = payload.payload as TypingIndicator;
        
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.user_id !== typingData.user_id);
          return [...filtered, { ...typingData, is_typing: true }];
        });

        // Auto-clear typing after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => 
            prev.filter(u => u.user_id !== typingData.user_id)
          );
        }, 3000);
      })
      .on('broadcast', { event: 'typing_stop' }, (payload) => {
        const { user_id } = payload.payload;
        setTypingUsers(prev => prev.filter(u => u.user_id !== user_id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
}

export function usePresence(accountId: string, userId: string) {
  const supabase = useSupabaseClient();
  const [presenceData, setPresenceData] = useState<Record<string, any>>({});

  const updatePresence = useCallback(
    (status: 'online' | 'offline' | 'busy') => {
      if (!accountId || !userId) return;

      const channel = supabase.channel(`account:${accountId}:presence`);
      
      channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
        status,
      });
    },
    [accountId, userId, supabase]
  );

  useEffect(() => {
    if (!accountId || !userId) return;

    const channel = supabase
      .channel(`account:${accountId}:presence`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresenceData(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          updatePresence('online');
        }
      });

    // Update presence on page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('offline');
      } else {
        updatePresence('online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      updatePresence('offline');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [accountId, userId, supabase, updatePresence]);

  return {
    presenceData,
    updatePresence,
  };
}