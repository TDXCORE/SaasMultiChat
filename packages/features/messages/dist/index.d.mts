import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _tanstack_react_query from '@tanstack/react-query';
import * as react from 'react';

declare function FileUploadZone(): react_jsx_runtime.JSX.Element;

declare function MessageTemplatePicker(): react_jsx_runtime.JSX.Element;

declare function QuickReplies(): react_jsx_runtime.JSX.Element;
declare function ShortcutIndicator(): react_jsx_runtime.JSX.Element;
declare function useQuickReplyShortcuts(): {
    handleShortcut: () => void;
};

interface Message {
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
interface MessageInsert {
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
interface MessageUpdate {
    content?: string;
    message_type?: 'incoming' | 'outgoing' | 'activity';
    content_type?: 'text' | 'input_email' | 'input_text' | 'cards' | 'form' | 'article' | 'incoming_email';
    private?: boolean;
    sender_type?: 'User' | 'Contact' | 'Agent';
    sender_id?: string;
    external_source_id?: string;
    additional_attributes?: Record<string, any>;
}
interface Attachment {
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
interface AttachmentInsert {
    message_id: string;
    file_type: 'image' | 'audio' | 'video' | 'file';
    file_size?: number;
    fallback_title?: string;
    data_url?: string;
    external_url?: string;
    coordinates_lat?: number;
    coordinates_long?: number;
}
interface MessageWithDetails extends Message {
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
interface AttachmentWithDetails extends Attachment {
    download_url?: string;
    is_image?: boolean;
    is_video?: boolean;
    is_audio?: boolean;
    is_document?: boolean;
}
interface CreateMessagePayload {
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
interface CreateAttachmentPayload {
    file_type: 'image' | 'audio' | 'video' | 'file';
    file_size?: number;
    fallback_title?: string;
    data_url?: string;
    external_url?: string;
    coordinates_lat?: number;
    coordinates_long?: number;
}
interface MessageFilters {
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
interface MessageStats {
    total_messages: number;
    messages_today: number;
    avg_response_time: number;
    attachment_count: number;
}
interface FileUploadProgress {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
    attachment_id?: string;
}
interface MessageTemplate {
    id: string;
    title: string;
    content: string;
    variables?: string[];
    category?: string;
}
interface QuickReply {
    id: string;
    title: string;
    content: string;
    shortcut?: string;
}
interface MessagePreview {
    id: string;
    content: string;
    sender_type: string;
    created_at: string;
    has_attachments: boolean;
}

declare function useFileUpload(): {
    uploads: FileUploadProgress[];
    uploadFile: (file: File, messageId?: string, onProgress?: (progress: number) => void) => Promise<string>;
    createAttachment: _tanstack_react_query.UseMutateFunction<{
        created_at: string;
        updated_at: string;
        file_type: "image" | "audio" | "video" | "file";
        file_size?: number;
        fallback_title?: string;
        data_url?: string;
        external_url?: string;
        coordinates_lat?: number;
        coordinates_long?: number;
        id: string;
        message_id: string;
    }, Error, {
        messageId: string;
        attachmentData: CreateAttachmentPayload;
    }, unknown>;
    isCreatingAttachment: boolean;
    clearUploads: () => void;
    removeUpload: (file: File) => void;
};
declare function useAttachmentPreview(): {
    getFileType: (filename: string) => string;
    getFileIcon: (fileType: string) => "🖼️" | "🎥" | "🎵" | "📄" | "📎";
    formatFileSize: (bytes: number) => string;
    isPreviewable: (fileType: string) => boolean;
};

declare function useMessageTemplates(accountId: string): _tanstack_react_query.UseQueryResult<MessageTemplate[], Error>;
declare function useQuickReplies(accountId: string): _tanstack_react_query.UseQueryResult<QuickReply[], Error>;
declare function useTemplateVariables(): {
    variables: Record<string, string>;
    setVariable: (key: string, value: string) => void;
    clearVariables: () => void;
    processTemplate: (template: string, vars?: Record<string, string>) => string;
    extractVariables: (template: string) => string[];
};
declare function useTemplateSearch(): {
    searchTerm: string;
    setSearchTerm: react.Dispatch<react.SetStateAction<string>>;
    selectedCategory: string;
    setSelectedCategory: react.Dispatch<react.SetStateAction<string>>;
    filterTemplates: (templates: MessageTemplate[], search?: string, category?: string) => MessageTemplate[];
    getCategories: (templates: MessageTemplate[]) => string[];
};

export { type Attachment, type AttachmentInsert, type AttachmentWithDetails, type CreateAttachmentPayload, type CreateMessagePayload, type FileUploadProgress, FileUploadZone, type Message, type MessageFilters, type MessageInsert, type MessagePreview, type MessageStats, type MessageTemplate, MessageTemplatePicker, type MessageUpdate, type MessageWithDetails, QuickReplies, type QuickReply, ShortcutIndicator, useAttachmentPreview, useFileUpload, useMessageTemplates, useQuickReplies, useQuickReplyShortcuts, useTemplateSearch, useTemplateVariables };
