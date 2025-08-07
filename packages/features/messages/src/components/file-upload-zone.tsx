'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@kit/ui/button';
import { Progress } from '@kit/ui/progress';
import { cn } from '@kit/ui/utils';
import { Upload, X, FileIcon, ImageIcon, VideoIcon, Music } from 'lucide-react';
import { useFileUpload, useAttachmentPreview } from '../hooks/use-attachments';
import type { FileUploadProgress } from '../types';

interface FileUploadZoneProps {
  onFilesUploaded?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  className?: string;
}

export function FileUploadZone({
  onFilesUploaded,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.webm', '.ogg'],
    'audio/*': ['.mp3', '.wav', '.ogg'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  className
}: FileUploadZoneProps) {
  const { uploads, uploadFile, removeUpload, clearUploads } = useFileUpload();
  const { getFileType, getFileIcon, formatFileSize } = useAttachmentPreview();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadPromises = acceptedFiles.map(file => uploadFile(file));
    
    try {
      const urls = await Promise.all(uploadPromises);
      onFilesUploaded?.(urls);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [uploadFile, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: true,
  });

  const handleRemoveUpload = (upload: FileUploadProgress) => {
    removeUpload(upload.file);
  };

  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const pendingUploads = uploads.filter(upload => upload.status === 'uploading');
  const errorUploads = uploads.filter(upload => upload.status === 'error');

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          'hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
        
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {pendingUploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploading...</h4>
          {pendingUploads.map((upload) => (
            <UploadProgress
              key={upload.file.name}
              upload={upload}
              onRemove={handleRemoveUpload}
            />
          ))}
        </div>
      )}

      {/* Error Files */}
      {errorUploads.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-destructive">Upload Errors</h4>
          {errorUploads.map((upload) => (
            <div
              key={upload.file.name}
              className="flex items-center justify-between p-2 bg-destructive/10 rounded-md"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileIcon className="h-4 w-4 text-destructive flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{upload.file.name}</p>
                  <p className="text-xs text-destructive">{upload.error}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveUpload(upload)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Files */}
      {completedUploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Uploaded Files ({completedUploads.length})</h4>
            {completedUploads.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearUploads}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          {completedUploads.map((upload) => (
            <CompletedFile
              key={upload.file.name}
              upload={upload}
              onRemove={handleRemoveUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface UploadProgressProps {
  upload: FileUploadProgress;
  onRemove: (upload: FileUploadProgress) => void;
}

function UploadProgress({ upload, onRemove }: UploadProgressProps) {
  const { formatFileSize } = useAttachmentPreview();

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
      <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium truncate">{upload.file.name}</p>
          <span className="text-xs text-muted-foreground">
            {Math.round(upload.progress)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={upload.progress} className="flex-1 h-1" />
          <span className="text-xs text-muted-foreground">
            {formatFileSize(upload.file.size)}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(upload)}
        className="h-6 w-6 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface CompletedFileProps {
  upload: FileUploadProgress;
  onRemove: (upload: FileUploadProgress) => void;
}

function CompletedFile({ upload, onRemove }: CompletedFileProps) {
  const { getFileType, formatFileSize } = useAttachmentPreview();
  const fileType = getFileType(upload.file.name);

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <VideoIcon className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
      <div className="text-green-600 dark:text-green-400">
        {getFileTypeIcon(fileType)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-green-700 dark:text-green-300">
          {upload.file.name}
        </p>
        <p className="text-xs text-green-600 dark:text-green-400">
          {formatFileSize(upload.file.size)} • {fileType}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(upload)}
        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}