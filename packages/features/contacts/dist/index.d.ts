import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';

declare function ContactList(): react_jsx_runtime.JSX.Element;

declare function ContactDetails(): react_jsx_runtime.JSX.Element;

interface Contact {
    id: string;
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
    created_at: string;
    updated_at: string;
}
interface ContactInsert {
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
interface ContactUpdate {
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
interface ContactWithDetails extends Contact {
    conversations_count?: number;
    last_conversation_at?: string;
    labels?: ContactLabel[];
}
interface ContactLabel {
    id: string;
    name: string;
    color: string;
    description?: string;
}
interface ContactFilters {
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
interface CreateContactPayload {
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
interface UpdateContactPayload extends Partial<Omit<Contact, 'id' | 'account_id' | 'created_at' | 'updated_at'>> {
}
interface BulkContactAction {
    contact_ids: string[];
    action: 'delete' | 'block' | 'unblock' | 'add_label' | 'remove_label';
    payload?: {
        label_id?: string;
    };
}
interface ContactImportData {
    name?: string;
    email?: string;
    phone_number?: string;
    location?: string;
    custom_attributes?: Record<string, any>;
}
interface ContactStats {
    total_contacts: number;
    new_this_month: number;
    blocked_contacts: number;
    contacts_with_conversations: number;
}

declare function useContacts(accountId: string): _tanstack_react_query.UseQueryResult<ContactWithDetails[], Error>;
declare function useContact(contactId: string): _tanstack_react_query.UseQueryResult<ContactWithDetails | null, Error>;
declare function useCreateContact(): _tanstack_react_query.UseMutationResult<any, Error, any, unknown>;
declare function useUpdateContact(): _tanstack_react_query.UseMutationResult<any, Error, {
    contactId: string;
    updates: any;
}, unknown>;
declare function useDeleteContact(): _tanstack_react_query.UseMutationResult<void, Error, string, unknown>;
declare function useRealtimeContacts(accountId: string): void;

export { type BulkContactAction, type Contact, ContactDetails, type ContactFilters, type ContactImportData, type ContactInsert, type ContactLabel, ContactList, type ContactStats, type ContactUpdate, type ContactWithDetails, type CreateContactPayload, type UpdateContactPayload, useContact, useContacts, useCreateContact, useDeleteContact, useRealtimeContacts, useUpdateContact };
