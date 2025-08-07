// src/components/conversation-list.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function ConversationList() {
  return /* @__PURE__ */ jsxs("div", { className: "h-full border-r bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Conversations" }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Sample Conversation 1" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 border rounded-lg", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Sample Conversation 2" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 text-xs text-gray-500", children: "Conversation list placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/message-list.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function MessageList() {
  return /* @__PURE__ */ jsxs2("div", { className: "flex-1 flex flex-col", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex-1 p-4 space-y-4", children: [
      /* @__PURE__ */ jsx2("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxs2("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "text-sm", children: "Hello! How can I help you today?" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-gray-500 mt-1", children: "10:30 AM" })
      ] }) }),
      /* @__PURE__ */ jsx2("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs2("div", { className: "max-w-xs bg-blue-500 text-white rounded-lg p-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "text-sm", children: "I need help with my account" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-blue-100 mt-1", children: "10:32 AM" })
      ] }) }),
      /* @__PURE__ */ jsx2("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxs2("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "text-sm", children: "I'd be happy to help you with your account. What specific issue are you experiencing?" }),
        /* @__PURE__ */ jsx2("div", { className: "text-xs text-gray-500 mt-1", children: "10:33 AM" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "p-4 text-xs text-gray-500 text-center", children: "Message list placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/message-input.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function MessageInput() {
  return /* @__PURE__ */ jsxs3("div", { className: "border-t bg-background p-4", children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex gap-2 items-end", children: [
      /* @__PURE__ */ jsx3("div", { className: "flex-1", children: /* @__PURE__ */ jsx3(
        "textarea",
        {
          placeholder: "Type your message...",
          className: "w-full min-h-[44px] max-h-[120px] resize-none border rounded-md p-2",
          rows: 1
        }
      ) }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          className: "h-11 w-11 bg-blue-500 text-white rounded-md flex items-center justify-center",
          disabled: true,
          children: "Send"
        }
      )
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "mt-2 text-xs text-gray-500", children: "Message input placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/conversation-header.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function ConversationHeader() {
  return /* @__PURE__ */ jsxs4("div", { className: "border-b bg-background p-4", children: [
    /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx4("div", { className: "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx4("span", { className: "text-sm font-medium", children: "JD" }) }),
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx4("h3", { className: "font-semibold", children: "John Doe" }),
          /* @__PURE__ */ jsx4("p", { className: "text-sm text-gray-500", children: "john.doe@example.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: "Open" }),
        /* @__PURE__ */ jsx4("button", { className: "p-2 hover:bg-gray-100 rounded-md", children: /* @__PURE__ */ jsx4("span", { className: "text-gray-500", children: "\u22EF" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "mt-4 text-xs text-gray-500", children: "Conversation header placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/conversation-view.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function ConversationView() {
  return /* @__PURE__ */ jsxs5("div", { className: "flex h-full", children: [
    /* @__PURE__ */ jsxs5("div", { className: "w-1/3 border-r", children: [
      /* @__PURE__ */ jsx5("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx5("h2", { className: "text-lg font-semibold", children: "Conversations" }) }),
      /* @__PURE__ */ jsx5("div", { className: "p-4", children: /* @__PURE__ */ jsxs5("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs5("div", { className: "p-3 border rounded-lg bg-blue-50", children: [
          /* @__PURE__ */ jsx5("div", { className: "font-medium", children: "Active Conversation" }),
          /* @__PURE__ */ jsx5("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsx5("div", { className: "font-medium", children: "Another Conversation" }),
          /* @__PURE__ */ jsx5("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsx5("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsx5("h3", { className: "font-semibold", children: "Conversation with Customer" }) }),
      /* @__PURE__ */ jsxs5("div", { className: "flex-1 p-4 space-y-4", children: [
        /* @__PURE__ */ jsx5("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxs5("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
          /* @__PURE__ */ jsx5("div", { className: "text-sm", children: "Hello! How can I help you today?" }),
          /* @__PURE__ */ jsx5("div", { className: "text-xs text-gray-500 mt-1", children: "10:30 AM" })
        ] }) }),
        /* @__PURE__ */ jsx5("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs5("div", { className: "max-w-xs bg-blue-500 text-white rounded-lg p-3", children: [
          /* @__PURE__ */ jsx5("div", { className: "text-sm", children: "I need help with my account" }),
          /* @__PURE__ */ jsx5("div", { className: "text-xs text-blue-100 mt-1", children: "10:32 AM" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "border-t p-4", children: /* @__PURE__ */ jsxs5("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx5(
          "input",
          {
            type: "text",
            placeholder: "Type your message...",
            className: "flex-1 border rounded-md p-2"
          }
        ),
        /* @__PURE__ */ jsx5("button", { className: "bg-blue-500 text-white px-4 py-2 rounded-md", children: "Send" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "absolute bottom-4 right-4 text-xs text-gray-500", children: "Conversation view placeholder - React 19 compatibility pending" })
  ] });
}

// src/hooks/use-conversations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
function useConversations(accountId) {
  return useQuery({
    queryKey: ["conversations", accountId],
    queryFn: async () => {
      return [];
    },
    enabled: !!accountId,
    staleTime: 3e4
    // 30 seconds
  });
}
function useConversation(conversationId) {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      return null;
    },
    enabled: !!conversationId
  });
}
function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      return {
        id: "placeholder",
        account_id: payload.account_id,
        inbox_id: payload.inbox_id,
        contact_id: payload.contact_id,
        status: "open",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", data.account_id]
      });
    }
  });
}
function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      status
    }) => {
      console.log("Update conversation status placeholder:", { conversationId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });
}
function useAssignConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      assigneeId
    }) => {
      console.log("Assign conversation placeholder:", { conversationId, assigneeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });
}
function useRealtimeConversations(accountId) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!accountId) return;
    console.log("Realtime conversations placeholder for account:", accountId);
    return () => {
    };
  }, [accountId, queryClient]);
}

// src/hooks/use-messages.ts
import { useQuery as useQuery2, useMutation as useMutation2, useQueryClient as useQueryClient2 } from "@tanstack/react-query";
import { useEffect as useEffect2 } from "react";
function useMessages(conversationId) {
  return useQuery2({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return [];
    },
    enabled: !!conversationId,
    staleTime: 0
  });
}
function useCreateMessage() {
  const queryClient = useQueryClient2();
  return useMutation2({
    mutationFn: async (payload) => {
      return {
        id: "placeholder",
        conversation_id: payload.conversation_id,
        content: payload.content,
        message_type: payload.message_type || "outgoing",
        content_type: payload.content_type || "text",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["messages", data.conversation_id],
        (old = []) => [...old, data]
      );
      queryClient.invalidateQueries({
        queryKey: ["conversations"]
      });
    }
  });
}
function useRealtimeMessages(conversationId) {
  const queryClient = useQueryClient2();
  useEffect2(() => {
    if (!conversationId) return;
    console.log("Realtime messages placeholder for conversation:", conversationId);
    return () => {
    };
  }, [conversationId, queryClient]);
}
function useMarkAsRead() {
  return useMutation2({
    mutationFn: async ({
      conversationId,
      userId
    }) => {
      console.log("Mark as read placeholder:", { conversationId, userId });
    }
  });
}
export {
  ConversationHeader,
  ConversationList,
  ConversationView,
  MessageInput,
  MessageList,
  useAssignConversation,
  useConversation,
  useConversations,
  useCreateConversation,
  useCreateMessage,
  useMarkAsRead,
  useMessages,
  useRealtimeConversations,
  useRealtimeMessages,
  useUpdateConversationStatus
};
