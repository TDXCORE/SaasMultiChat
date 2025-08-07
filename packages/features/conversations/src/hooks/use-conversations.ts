import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@kit/supabase/client';
import type { 
  ConversationWithDetails, 
  ConversationFilters,
  UpdateConversationPayload,
  BulkConversationAction 
} from '../types';

export function useConversations(
  accountId: string, 
  filters: ConversationFilters = {}
) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['conversations', accountId, filters],
    queryFn: async () => {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          contact:contacts(*),
          assignee:users(*),
          inbox:inboxes(*),
          team:teams(*),
          labels:conversation_labels(label:labels(*))
        `)
        .eq('account_id', accountId);

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.assignee_id && filters.assignee_id !== 'all') {
        if (filters.assignee_id === 'unassigned') {
          query = query.is('assignee_id', null);
        } else {
          query = query.eq('assignee_id', filters.assignee_id);
        }
      }
      
      if (filters.inbox_id && filters.inbox_id !== 'all') {
        query = query.eq('inbox_id', filters.inbox_id);
      }
      
      if (filters.team_id && filters.team_id !== 'all') {
        query = query.eq('team_id', filters.team_id);
      }

      // Sorting
      const sortBy = filters.sort_by || 'last_activity_at';
      const sortOrder = filters.sort_order === 'asc' ? { ascending: true } : { ascending: false };
      query = query.order(sortBy, sortOrder);

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 25;
      const start = (page - 1) * limit;
      const end = start + limit - 1;
      query = query.range(start, end);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        conversations: (data || []) as ConversationWithDetails[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useConversation(conversationId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          contact:contacts(*),
          assignee:users(*),
          inbox:inboxes(*),
          team:teams(*),
          labels:conversation_labels(label:labels(*))
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data as ConversationWithDetails;
    },
    enabled: !!conversationId,
  });
}

export function useUpdateConversation() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      payload 
    }: { 
      conversationId: string; 
      payload: UpdateConversationPayload;
    }) => {
      const { data, error } = await supabase
        .from('conversations')
        .update(payload)
        .eq('id', conversationId)
        .select(`
          *,
          contact:contacts(*),
          assignee:users(*),
          inbox:inboxes(*),
          team:teams(*),
          labels:conversation_labels(label:labels(*))
        `)
        .single();

      if (error) throw error;
      return data as ConversationWithDetails;
    },
    onSuccess: (data) => {
      // Update conversation cache
      queryClient.setQueryData(['conversation', data.id], data);
      
      // Update conversations list cache
      queryClient.invalidateQueries({ 
        queryKey: ['conversations', data.account_id] 
      });
    },
  });
}

export function useConversationUpdate() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<UpdateConversationPayload>;
    }) => {
      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          contact:contacts(*),
          assignee:users(*),
          inbox:inboxes(*),
          team:teams(*),
          labels:conversation_labels(label:labels(*))
        `)
        .single();

      if (error) throw error;
      return data as ConversationWithDetails;
    },
    onSuccess: (data) => {
      // Update conversation cache
      queryClient.setQueryData(['conversation', data.id], data);
      
      // Update conversations list cache
      queryClient.invalidateQueries({ 
        queryKey: ['conversations', data.account_id] 
      });
    },
  });
}

export function useBulkUpdateConversations() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (action: BulkConversationAction) => {
      const { conversation_ids, action: actionType, payload } = action;
      
      let updateData: Partial<UpdateConversationPayload> = {};
      
      switch (actionType) {
        case 'assign':
          updateData = { assignee_id: payload?.assignee_id };
          break;
        case 'unassign':
          updateData = { assignee_id: null };
          break;
        case 'resolve':
          updateData = { status: 'resolved' };
          break;
        case 'reopen':
          updateData = { status: 'open' };
          break;
        case 'snooze':
          updateData = { 
            status: 'snoozed',
            snoozed_until: payload?.snooze_until 
          };
          break;
      }

      const { data, error } = await supabase
        .from('conversations')
        .update(updateData)
        .in('id', conversation_ids)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Get the first conversation's account_id for cache invalidation
      queryClient.invalidateQueries({ 
        queryKey: ['conversations'] 
      });
      
      // Invalidate individual conversation caches
      variables.conversation_ids.forEach(id => {
        queryClient.invalidateQueries({ 
          queryKey: ['conversation', id] 
        });
      });
    },
  });
}