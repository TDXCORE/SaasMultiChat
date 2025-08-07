import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@kit/supabase/client';
import type { 
  ContactWithDetails, 
  ContactFilters,
  CreateContactPayload,
  UpdateContactPayload,
  BulkContactAction,
  ContactStats
} from '../types';

export function useContacts(
  accountId: string, 
  filters: ContactFilters = {}
) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['contacts', accountId, filters],
    queryFn: async () => {
      let query = supabase
        .from('contacts')
        .select(`
          *,
          conversations:conversations(count),
          labels:contact_labels(label:labels(*))
        `)
        .eq('account_id', accountId);

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%`);
      }
      
      if (filters.source && filters.source !== 'all') {
        query = query.eq('source', filters.source);
      }
      
      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      
      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }

      // Sorting
      const sortBy = filters.sort_by || 'created_at';
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
        contacts: (data || []).map(contact => ({
          ...contact,
          conversations_count: contact.conversations?.[0]?.count || 0,
        })) as ContactWithDetails[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useContact(contactId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['contact', contactId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          conversations:conversations(
            id,
            status,
            created_at,
            last_activity_at,
            inbox:inboxes(name)
          ),
          labels:contact_labels(label:labels(*))
        `)
        .eq('id', contactId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        conversations_count: data.conversations?.length || 0,
        last_conversation_at: data.conversations?.length > 0 
          ? data.conversations[0].last_activity_at 
          : null,
      } as ContactWithDetails;
    },
    enabled: !!contactId,
  });
}

export function useCreateContact() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: CreateContactPayload) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          account_id: payload.account_id,
          name: payload.name,
          email: payload.email,
          phone_number: payload.phone_number,
          avatar_url: payload.avatar_url,
          identifier: payload.identifier,
          additional_attributes: payload.additional_attributes,
          custom_attributes: payload.custom_attributes,
          location: payload.location,
          country_code: payload.country_code,
          blocked: payload.blocked || false,
          source: payload.source || 'manual',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update contacts list cache
      queryClient.invalidateQueries({ 
        queryKey: ['contacts', data.account_id] 
      });
    },
  });
}

export function useUpdateContact() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      contactId, 
      payload 
    }: { 
      contactId: string; 
      payload: UpdateContactPayload;
    }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(payload)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update contact cache
      queryClient.setQueryData(['contact', data.id], data);
      
      // Update contacts list cache
      queryClient.invalidateQueries({ 
        queryKey: ['contacts', data.account_id] 
      });
    },
  });
}

export function useDeleteContact() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactId: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      return contactId;
    },
    onSuccess: (contactId, variables) => {
      // Remove contact from cache
      queryClient.removeQueries({ 
        queryKey: ['contact', contactId] 
      });
      
      // Update contacts list cache
      queryClient.invalidateQueries({ 
        queryKey: ['contacts'] 
      });
    },
  });
}

export function useBulkUpdateContacts() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (action: BulkContactAction) => {
      const { contact_ids, action: actionType, payload } = action;
      
      switch (actionType) {
        case 'delete':
          const { error: deleteError } = await supabase
            .from('contacts')
            .delete()
            .in('id', contact_ids);
          if (deleteError) throw deleteError;
          break;
          
        case 'block':
          const { error: blockError } = await supabase
            .from('contacts')
            .update({ blocked: true })
            .in('id', contact_ids);
          if (blockError) throw blockError;
          break;
          
        case 'unblock':
          const { error: unblockError } = await supabase
            .from('contacts')
            .update({ blocked: false })
            .in('id', contact_ids);
          if (unblockError) throw unblockError;
          break;
          
        case 'add_label':
        case 'remove_label':
          // TODO: Implement label operations when contact_labels table is used
          break;
      }
      
      return contact_ids;
    },
    onSuccess: (contact_ids) => {
      // Update contacts list cache
      queryClient.invalidateQueries({ 
        queryKey: ['contacts'] 
      });
      
      // Remove individual contact caches for deleted contacts
      contact_ids.forEach(id => {
        queryClient.removeQueries({ 
          queryKey: ['contact', id] 
        });
      });
    },
  });
}

export function useContactStats(accountId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['contact-stats', accountId],
    queryFn: async (): Promise<ContactStats> => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Get total contacts
      const { count: totalContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('account_id', accountId);
      
      // Get new contacts this month
      const { count: newThisMonth } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('account_id', accountId)
        .gte('created_at', startOfMonth.toISOString());
      
      // Get blocked contacts
      const { count: blockedContacts } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('account_id', accountId)
        .eq('blocked', true);
      
      // Get contacts with conversations
      const { count: contactsWithConversations } = await supabase
        .from('contacts')
        .select('id, conversations!inner(id)', { count: 'exact', head: true })
        .eq('account_id', accountId);
      
      return {
        total_contacts: totalContacts || 0,
        new_this_month: newThisMonth || 0,
        blocked_contacts: blockedContacts || 0,
        contacts_with_conversations: contactsWithConversations || 0,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}