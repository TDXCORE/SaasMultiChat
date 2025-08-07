import type { Database } from '@kit/supabase/database';

export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

export interface ContactWithDetails extends Contact {
  conversations_count?: number;
  last_conversation_at?: string;
  labels?: ContactLabel[];
}

export interface ContactLabel {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface ContactFilters {
  search?: string;
  labels?: string[];
  source?: string;
  created_after?: string;
  created_before?: string;
  sort_by?: 'name' | 'email' | 'created_at' | 'last_activity_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateContactPayload {
  account_id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  identifier?: string;
  additional_attributes?: Record<string, any>;
  custom_attributes?: Record<string, any>;
  location?: string;
  country_code?: string;
  blocked?: boolean;
  source?: string;
}

export interface UpdateContactPayload extends Partial<Omit<Contact, 'id' | 'account_id' | 'created_at' | 'updated_at'>> {}

export interface BulkContactAction {
  contact_ids: string[];
  action: 'delete' | 'block' | 'unblock' | 'add_label' | 'remove_label';
  payload?: {
    label_id?: string;
  };
}

export interface ContactImportData {
  name?: string;
  email?: string;
  phone_number?: string;
  location?: string;
  custom_attributes?: Record<string, any>;
}

export interface ContactStats {
  total_contacts: number;
  new_this_month: number;
  blocked_contacts: number;
  contacts_with_conversations: number;
}