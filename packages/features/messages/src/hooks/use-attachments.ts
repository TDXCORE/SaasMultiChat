import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@kit/supabase/client';
import { useState, useCallback } from 'react';
import type { FileUploadProgress, CreateAttachmentPayload } from '../types';

export function useFileUpload() {
  const supabase = useSupabaseClient();
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
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            onProgress?.(percentage);
            
            setUploads(prev => prev.map(upload => 
              upload.file === file 
                ? { ...upload, progress: percentage }
                : upload
            ));
          }
        });

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('attachments')
        .insert({
          message_id: messageId,
          file_type: attachmentData.file_type,
          file_size: attachmentData.file_size,
          fallback_title: attachmentData.fallback_title,
          data_url: attachmentData.data_url,
          external_url: attachmentData.external_url,
          coordinates_lat: attachmentData.coordinates_lat,
          coordinates_long: attachmentData.coordinates_long,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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