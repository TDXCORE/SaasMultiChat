import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';

declare function ConversationList(): react_jsx_runtime.JSX.Element;

declare function MessageList(): react_jsx_runtime.JSX.Element;

declare function MessageInput(): react_jsx_runtime.JSX.Element;

declare function ConversationHeader(): react_jsx_runtime.JSX.Element;

declare function ConversationView(): react_jsx_runtime.JSX.Element;

type ConversationStatus = 'open' | 'resolved' | 'pending' | 'snoozed';
type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent';
type MessageType = 'incoming' | 'outgoing' | 'activity';
type ContentType = 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
interface Conversation {
    id: string;
    account_id: string;
    contact_id?: string;
    inbox_id: string;
    assignee_id?: string;
    team_id?: string;
    status: ConversationStatus;
    priority?: ConversationPriority;
    last_activity_at: string;
    created_at: string;
    updated_at: string;
    custom_attributes?: Record<string, any>;
    snoozed_until?: string;
}
interface Message {
    id: string;
    conversation_id: string;
    content: string;
    message_type: MessageType;
    content_type: ContentType;
    private: boolean;
    sender_type: 'User' | 'Contact' | 'Agent';
    sender_id?: string;
    external_source_id?: string;
    additional_attributes?: Record<string, any>;
    created_at: string;
    updated_at: string;
}
interface Contact {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}
interface User {
    id: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}
interface Inbox {
    id: string;
    name: string;
    account_id: string;
    created_at: string;
    updated_at: string;
}
interface Team {
    id: string;
    name: string;
    account_id: string;
    created_at: string;
    updated_at: string;
}
interface Label {
    id: string;
    title: string;
    color: string;
    account_id: string;
    created_at: string;
    updated_at: string;
}
interface ConversationWithDetails extends Conversation {
    contact?: Contact | null;
    assignee?: User | null;
    inbox: Inbox;
    team?: Team | null;
    labels?: Label[];
    messages?: MessageWithSender[];
    unread_count?: number;
    last_message?: MessageWithSender;
}
interface MessageWithSender extends Message {
    sender?: User | Contact | null;
    attachments?: any[];
    is_sent_by_user?: boolean;
}
interface ConversationFilters {
    status?: ConversationStatus | 'all';
    assignee_id?: string | 'me' | 'unassigned' | 'all';
    inbox_id?: string | 'all';
    team_id?: string | 'all';
    label_ids?: string[];
    search?: string;
    sort_by?: 'last_activity_at' | 'created_at' | 'updated_at';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
interface ConversationStats {
    total_conversations: number;
    open_conversations: number;
    resolved_conversations: number;
    pending_conversations: number;
    average_response_time: number;
    average_resolution_time: number;
    conversation_trends: Array<{
        date: string;
        open: number;
        resolved: number;
    }>;
}
interface CreateMessagePayload {
    conversation_id: string;
    content: string;
    message_type?: MessageType;
    content_type?: ContentType;
    private?: boolean;
    sender_type?: 'User' | 'Contact';
    attachments?: Array<{
        file_type: string;
        file_url: string;
        file_name: string;
    }>;
}
interface UpdateConversationPayload {
    status?: ConversationStatus;
    assignee_id?: string | null;
    team_id?: string | null;
    priority?: ConversationPriority | null;
    custom_attributes?: Record<string, any>;
    snoozed_until?: string | null;
}
interface BulkConversationAction {
    conversation_ids: string[];
    action: 'assign' | 'unassign' | 'resolve' | 'reopen' | 'snooze' | 'add_label' | 'remove_label';
    payload?: {
        assignee_id?: string;
        team_id?: string;
        label_ids?: string[];
        snooze_until?: string;
    };
}
interface ConversationRealtimeEvent {
    type: 'conversation_updated' | 'message_created' | 'typing_start' | 'typing_stop' | 'presence_update';
    conversation_id: string;
    account_id: string;
    data: any;
}
interface ConversationAssignmentConfig {
    enable_auto_assignment: boolean;
    assignment_strategy: 'round_robin' | 'load_based' | 'manual';
    allowed_teams?: string[];
    allowed_agents?: string[];
    working_hours_only: boolean;
}
interface TypingIndicator {
    user_id: string;
    user_name: string;
    conversation_id: string;
    is_typing: boolean;
    timestamp: string;
}

declare function useConversations(accountId: string): _tanstack_react_query.UseQueryResult<ConversationWithDetails[], Error>;
declare function useConversation(conversationId: string): _tanstack_react_query.UseQueryResult<ConversationWithDetails | null, Error>;
declare function useCreateConversation(): _tanstack_react_query.UseMutationResult<any, Error, any, unknown>;
declare function useUpdateConversationStatus(): _tanstack_react_query.UseMutationResult<void, Error, {
    conversationId: string;
    status: ConversationStatus;
}, unknown>;
declare function useAssignConversation(): _tanstack_react_query.UseMutationResult<void, Error, {
    conversationId: string;
    assigneeId: string | null;
}, unknown>;
declare function useRealtimeConversations(accountId: string): void;

declare function useMessages(conversationId: string): _tanstack_react_query.UseQueryResult<MessageWithSender[], Error>;
declare function useCreateMessage(): _tanstack_react_query.UseMutationResult<any, Error, CreateMessagePayload, unknown>;
declare function useRealtimeMessages(conversationId: string): void;
declare function useMarkAsRead(): _tanstack_react_query.UseMutationResult<void, Error, {
    conversationId: string;
    userId: string;
}, unknown>;

export { type BulkConversationAction, type Contact, type ContentType, type Conversation, type ConversationAssignmentConfig, type ConversationFilters, ConversationHeader, ConversationList, type ConversationPriority, type ConversationRealtimeEvent, type ConversationStats, type ConversationStatus, ConversationView, type ConversationWithDetails, type CreateMessagePayload, type Inbox, type Label, type Message, MessageInput, MessageList, type MessageType, type MessageWithSender, type Team, type TypingIndicator, type UpdateConversationPayload, type User, useAssignConversation, useConversation, useConversations, useCreateConversation, useCreateMessage, useMarkAsRead, useMessages, useRealtimeConversations, useRealtimeMessages, useUpdateConversationStatus };
