// Placeholder types for messages feature
// These will be replaced with actual database types when the schema is implemented

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  message_type: 'incoming' | 'outgoing' | 'activity';
  content_type: 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
  private: boolean;
  sender_type: 'User' | 'Contact' | 'Agent';
  sender_id?: string;
  external_source_id?: string;
  additional_attributes?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MessageInsert {
  conversation_id: string;
  content: string;
  message_type?: 'incoming' | 'outgoing' | 'activity';
  content_type?: 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
  private?: boolean;
  sender_type?: 'User' | 'Contact' | 'Agent';
  sender_id?: string;
  external_source_id?: string;
  additional_attributes?: Record<string, any>;
}

export interface MessageUpdate {
  content?: string;
  message_type?: 'incoming' | 'outgoing' | 'activity';
  content_type?: 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
  private?: boolean;
  sender_type?: 'User' | 'Contact' | 'Agent';
  sender_id?: string;
  external_source_id?: string;
  additional_attributes?: Record<string, any>;
}

export interface Attachment {
  id: string;
  message_id: string;
  file_type: 'image' | 'audio' | 'video' | 'file';
  file_size?: number;
  fallback_title?: string;
  data_url?: string;
  external_url?: string;
  coordinates_lat?: number;
  coordinates_long?: number;
  created_at: string;
  updated_at: string;
}

export interface AttachmentInsert {
  message_id: string;
  file_type: 'image' | 'audio' | 'video' | 'file';
  file_size?: number;
  fallback_title?: string;
  data_url?: string;
  external_url?: string;
  coordinates_lat?: number;
  coordinates_long?: number;
}

export interface MessageWithDetails extends Message {
  sender?: {
    id: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  };
  conversation?: {
    id: string;
    status: string;
    contact_id?: string;
  };
  attachments?: AttachmentWithDetails[];
}

export interface AttachmentWithDetails extends Attachment {
  download_url?: string;
  is_image?: boolean;
  is_video?: boolean;
  is_audio?: boolean;
  is_document?: boolean;
}

export interface CreateMessagePayload {
  conversation_id: string;
  content: string;
  message_type?: 'incoming' | 'outgoing' | 'activity';
  content_type?: 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
  private?: boolean;
  sender_type?: 'User' | 'Contact' | 'Agent';
  attachments?: CreateAttachmentPayload[];
  external_source_id?: string;
  additional_attributes?: Record<string, any>;
}

export interface CreateAttachmentPayload {
  file_type: 'image' | 'audio' | 'video' | 'file';
  file_size?: number;
  fallback_title?: string;
  data_url?: string;
  external_url?: string;
  coordinates_lat?: number;
  coordinates_long?: number;
}

export interface MessageFilters {
  conversation_id?: string;
  sender_type?: string;
  message_type?: string;
  content_type?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  has_attachments?: boolean;
  sort_by?: 'created_at' | 'content';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MessageStats {
  total_messages: number;
  messages_today: number;
  avg_response_time: number;
  attachment_count: number;
}

export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  attachment_id?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  variables?: string[];
  category?: string;
}

export interface QuickReply {
  id: string;
  title: string;
  content: string;
  shortcut?: string;
}

export interface MessagePreview {
  id: string;
  content: string;
  sender_type: string;
  created_at: string;
  has_attachments: boolean;
}
