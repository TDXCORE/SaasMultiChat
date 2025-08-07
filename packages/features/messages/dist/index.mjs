var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/components/file-upload-zone.tsx
import { jsx } from "react/jsx-runtime";
function FileUploadZone() {
  return /* @__PURE__ */ jsx("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "File upload component placeholder" }) });
}

// src/components/message-template-picker.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function MessageTemplatePicker() {
  return /* @__PURE__ */ jsx2("div", { className: "p-4 border rounded-lg", children: /* @__PURE__ */ jsx2("p", { className: "text-gray-500", children: "Message template picker placeholder" }) });
}

// src/components/quick-replies.tsx
import { useCallback } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
function QuickReplies() {
  return /* @__PURE__ */ jsx3("div", { className: "p-4 border rounded-lg", children: /* @__PURE__ */ jsx3("p", { className: "text-gray-500", children: "Quick replies placeholder" }) });
}
function ShortcutIndicator() {
  return /* @__PURE__ */ jsx3("span", { className: "text-xs text-gray-400", children: "Shortcut placeholder" });
}
function useQuickReplyShortcuts() {
  const handleShortcut = useCallback(() => {
  }, []);
  return {
    handleShortcut
  };
}

// src/hooks/use-attachments.ts
import { useMutation } from "@tanstack/react-query";
import { useSupabase } from "@kit/supabase/hooks/use-supabase";
import { useState, useCallback as useCallback2 } from "react";
function useFileUpload() {
  const supabase = useSupabase();
  const [uploads, setUploads] = useState([]);
  const uploadFile = useCallback2(async (file, messageId, onProgress) => {
    const fileId = `${Date.now()}-${file.name}`;
    const filePath = `attachments/${fileId}`;
    setUploads((prev) => [...prev, {
      file,
      progress: 0,
      status: "uploading"
    }]);
    try {
      onProgress == null ? void 0 : onProgress(25);
      setUploads((prev) => prev.map(
        (upload) => upload.file === file ? __spreadProps(__spreadValues({}, upload), { progress: 25 }) : upload
      ));
      const { data, error } = await supabase.storage.from("message-attachments").upload(filePath, file);
      if (error) throw error;
      onProgress == null ? void 0 : onProgress(75);
      setUploads((prev) => prev.map(
        (upload) => upload.file === file ? __spreadProps(__spreadValues({}, upload), { progress: 75 }) : upload
      ));
      const { data: { publicUrl } } = supabase.storage.from("message-attachments").getPublicUrl(filePath);
      setUploads((prev) => prev.map(
        (upload) => upload.file === file ? __spreadProps(__spreadValues({}, upload), { progress: 100, status: "completed" }) : upload
      ));
      onProgress == null ? void 0 : onProgress(100);
      return publicUrl;
    } catch (error) {
      setUploads((prev) => prev.map(
        (upload) => upload.file === file ? __spreadProps(__spreadValues({}, upload), {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed"
        }) : upload
      ));
      throw error;
    }
  }, [supabase]);
  const createAttachment = useMutation({
    mutationFn: async ({
      messageId,
      attachmentData
    }) => {
      return __spreadProps(__spreadValues({
        id: `attachment-${Date.now()}`,
        message_id: messageId
      }, attachmentData), {
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  const clearUploads = useCallback2(() => {
    setUploads([]);
  }, []);
  const removeUpload = useCallback2((file) => {
    setUploads((prev) => prev.filter((upload) => upload.file !== file));
  }, []);
  return {
    uploads,
    uploadFile,
    createAttachment: createAttachment.mutate,
    isCreatingAttachment: createAttachment.isPending,
    clearUploads,
    removeUpload
  };
}
function useAttachmentPreview() {
  const getFileType = useCallback2((filename) => {
    var _a;
    const extension = ((_a = filename.split(".").pop()) == null ? void 0 : _a.toLowerCase()) || "";
    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoTypes = ["mp4", "webm", "ogg", "avi", "mov"];
    const audioTypes = ["mp3", "wav", "ogg", "aac", "m4a"];
    const documentTypes = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];
    if (imageTypes.includes(extension)) return "image";
    if (videoTypes.includes(extension)) return "video";
    if (audioTypes.includes(extension)) return "audio";
    if (documentTypes.includes(extension)) return "document";
    return "file";
  }, []);
  const getFileIcon = useCallback2((fileType) => {
    switch (fileType) {
      case "image":
        return "\u{1F5BC}\uFE0F";
      case "video":
        return "\u{1F3A5}";
      case "audio":
        return "\u{1F3B5}";
      case "document":
        return "\u{1F4C4}";
      default:
        return "\u{1F4CE}";
    }
  }, []);
  const formatFileSize = useCallback2((bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);
  const isPreviewable = useCallback2((fileType) => {
    return ["image", "video", "audio"].includes(fileType);
  }, []);
  return {
    getFileType,
    getFileIcon,
    formatFileSize,
    isPreviewable
  };
}

// src/hooks/use-message-templates.ts
import { useQuery } from "@tanstack/react-query";
import { useSupabase as useSupabase2 } from "@kit/supabase/hooks/use-supabase";
import { useState as useState2, useCallback as useCallback3 } from "react";
function useMessageTemplates(accountId) {
  const supabase = useSupabase2();
  return useQuery({
    queryKey: ["message-templates", accountId],
    queryFn: async () => {
      return [
        {
          id: "1",
          title: "Welcome Message",
          content: "Hello {{name}}! Thank you for contacting us. How can we help you today?",
          variables: ["name"],
          category: "greeting"
        },
        {
          id: "2",
          title: "Follow Up",
          content: "Hi {{name}}, I wanted to follow up on your inquiry about {{topic}}. Do you have any additional questions?",
          variables: ["name", "topic"],
          category: "follow-up"
        },
        {
          id: "3",
          title: "Closing",
          content: "Thank you for contacting us today! If you have any other questions, please don't hesitate to reach out.",
          variables: [],
          category: "closing"
        }
      ];
    },
    staleTime: 1e3 * 60 * 5
    // 5 minutes
  });
}
function useQuickReplies(accountId) {
  const supabase = useSupabase2();
  return useQuery({
    queryKey: ["quick-replies", accountId],
    queryFn: async () => {
      return [
        {
          id: "1",
          title: "Thank you",
          content: "Thank you for your message!",
          shortcut: "/thanks"
        },
        {
          id: "2",
          title: "Please hold",
          content: "Please give me a moment to look into this for you.",
          shortcut: "/hold"
        },
        {
          id: "3",
          title: "More info needed",
          content: "Could you please provide more details about your issue?",
          shortcut: "/info"
        },
        {
          id: "4",
          title: "Escalate",
          content: "I'm going to escalate this to a senior team member who can better assist you.",
          shortcut: "/escalate"
        }
      ];
    },
    staleTime: 1e3 * 60 * 5
    // 5 minutes
  });
}
function useTemplateVariables() {
  const [variables, setVariables] = useState2({});
  const setVariable = useCallback3((key, value) => {
    setVariables((prev) => __spreadProps(__spreadValues({}, prev), { [key]: value }));
  }, []);
  const clearVariables = useCallback3(() => {
    setVariables({});
  }, []);
  const processTemplate = useCallback3((template, vars = variables) => {
    let processedContent = template;
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      processedContent = processedContent.replace(regex, value);
    });
    return processedContent;
  }, [variables]);
  const extractVariables = useCallback3((template) => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(template)) !== null) {
      if (match[1] && !matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, []);
  return {
    variables,
    setVariable,
    clearVariables,
    processTemplate,
    extractVariables
  };
}
function useTemplateSearch() {
  const [searchTerm, setSearchTerm] = useState2("");
  const [selectedCategory, setSelectedCategory] = useState2("");
  const filterTemplates = useCallback3((templates, search = searchTerm, category = selectedCategory) => {
    return templates.filter((template) => {
      const matchesSearch = !search || template.title.toLowerCase().includes(search.toLowerCase()) || template.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || template.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);
  const getCategories = useCallback3((templates) => {
    const categories = templates.map((template) => template.category).filter((category) => !!category);
    return Array.from(new Set(categories));
  }, []);
  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filterTemplates,
    getCategories
  };
}
export {
  FileUploadZone,
  MessageTemplatePicker,
  QuickReplies,
  ShortcutIndicator,
  useAttachmentPreview,
  useFileUpload,
  useMessageTemplates,
  useQuickReplies,
  useQuickReplyShortcuts,
  useTemplateSearch,
  useTemplateVariables
};
