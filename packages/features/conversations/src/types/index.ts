import type { 
  Conversation, 
  Message, 
  Contact, 
  User, 
  Inbox, 
  Team, 
  Label,
  ConversationStatus,
  ConversationPriority,
  MessageType,
  ContentType
} from '~/lib/database.types';

// Extended conversation type with all relations
export interface ConversationWithDetails extends Conversation {
  contact?: Contact | null;
  assignee?: User | null;
  inbox: Inbox;
  team?: Team | null;
  labels?: Label[];
  messages?: MessageWithSender[];
  unread_count?: number;
  last_message?: MessageWithSender;
}

// Message with sender information
export interface MessageWithSender extends Message {
  sender?: User | Contact | null;
  attachments?: any[];
  is_sent_by_user?: boolean;
}

// Conversation filters for list view
export interface ConversationFilters {
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

// Conversation stats for dashboard
export interface ConversationStats {
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

// Message creation payload
export interface CreateMessagePayload {
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

// Conversation update payload
export interface UpdateConversationPayload {
  status?: ConversationStatus;
  assignee_id?: string | null;
  team_id?: string | null;
  priority?: ConversationPriority | null;
  custom_attributes?: Record<string, any>;
  snoozed_until?: string | null;
}

// Bulk conversation actions
export interface BulkConversationAction {
  conversation_ids: string[];
  action: 'assign' | 'unassign' | 'resolve' | 'reopen' | 'snooze' | 'add_label' | 'remove_label';
  payload?: {
    assignee_id?: string;
    team_id?: string;
    label_ids?: string[];
    snooze_until?: string;
  };
}

// Real-time conversation event
export interface ConversationRealtimeEvent {
  type: 'conversation_updated' | 'message_created' | 'typing_start' | 'typing_stop' | 'presence_update';
  conversation_id: string;
  account_id: string;
  data: any;
}

// Conversation assignment configuration
export interface ConversationAssignmentConfig {
  enable_auto_assignment: boolean;
  assignment_strategy: 'round_robin' | 'load_based' | 'manual';
  allowed_teams?: string[];
  allowed_agents?: string[];
  working_hours_only: boolean;
}

// Typing indicator data
export interface TypingIndicator {
  user_id: string;
  user_name: string;
  conversation_id: string;
  is_typing: boolean;
  timestamp: string;
}