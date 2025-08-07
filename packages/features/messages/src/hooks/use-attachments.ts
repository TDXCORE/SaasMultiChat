import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useState, useCallback } from 'react';
import type { FileUploadProgress, CreateAttachmentPayload } from '../types';

export function useFileUpload() {
  const supabase = useSupabase();
  const [uploads, setUploads] = useState<FileUploadProgress[]>([]);

  const uploadFile = useCallback(async (
    file: File,
    messageId?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileId = `${Date.now()}-${file.name}`;
    const filePath = `attachments/${fileId}`;

    // Add to uploads tracking
    setUploads(prev => [...prev, {
      file,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      // Simulate progress for now since Supabase storage doesn't support onUploadProgress in this version
      onProgress?.(25);
      
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 25 }
          : upload
      ));

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (error) throw error;

      onProgress?.(75);
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 75 }
          : upload
      ));

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      // Update upload status
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 100, status: 'completed' }
          : upload
      ));

      onProgress?.(100);
      return publicUrl;
    } catch (error) {
      // Update upload status on error
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { 
              ...upload, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : upload
      ));
      throw error;
    }
  }, [supabase]);

  const createAttachment = useMutation({
    mutationFn: async ({
      messageId,
      attachmentData
    }: {
      messageId: string;
      attachmentData: CreateAttachmentPayload;
    }) => {
      // For now, return a placeholder since the attachments table doesn't exist yet
      // This will be replaced when the proper database schema is implemented
      return {
        id: `attachment-${Date.now()}`,
        message_id: messageId,
        ...attachmentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
  });

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  const removeUpload = useCallback((file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  }, []);

  return {
    uploads,
    uploadFile,
    createAttachment: createAttachment.mutate,
    isCreatingAttachment: createAttachment.isPending,
    clearUploads,
    removeUpload,
  };
}

export function useAttachmentPreview() {
  const getFileType = useCallback((filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'avi', 'mov'];
    const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (audioTypes.includes(extension)) return 'audio';
    if (documentTypes.includes(extension)) return 'document';
    
    return 'file';
  }, []);

  const getFileIcon = useCallback((fileType: string) => {
    switch (fileType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      default:
        return '📎';
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const isPreviewable = useCallback((fileType: string): boolean => {
    return ['image', 'video', 'audio'].includes(fileType);
  }, []);

  return {
    getFileType,
    getFileIcon,
    formatFileSize,
    isPreviewable,
  };
}
