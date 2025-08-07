"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ConversationHeader: () => ConversationHeader,
  ConversationList: () => ConversationList,
  ConversationView: () => ConversationView,
  MessageInput: () => MessageInput,
  MessageList: () => MessageList,
  useAssignConversation: () => useAssignConversation,
  useConversation: () => useConversation,
  useConversations: () => useConversations,
  useCreateConversation: () => useCreateConversation,
  useCreateMessage: () => useCreateMessage,
  useMarkAsRead: () => useMarkAsRead,
  useMessages: () => useMessages,
  useRealtimeConversations: () => useRealtimeConversations,
  useRealtimeMessages: () => useRealtimeMessages,
  useUpdateConversationStatus: () => useUpdateConversationStatus
});
module.exports = __toCommonJS(index_exports);

// src/components/conversation-list.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function ConversationList() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-full border-r bg-background", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-lg font-semibold", children: "Conversations" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 border rounded-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-medium", children: "Sample Conversation 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 border rounded-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-medium", children: "Sample Conversation 2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 text-xs text-gray-500", children: "Conversation list placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/message-list.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function MessageList() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex-1 flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex-1 p-4 space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "flex justify-start", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-sm", children: "Hello! How can I help you today?" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: "10:30 AM" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "flex justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "max-w-xs bg-blue-500 text-white rounded-lg p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-sm", children: "I need help with my account" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-xs text-blue-100 mt-1", children: "10:32 AM" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "flex justify-start", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-sm", children: "I'd be happy to help you with your account. What specific issue are you experiencing?" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: "10:33 AM" })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "p-4 text-xs text-gray-500 text-center", children: "Message list placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/message-input.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function MessageInput() {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "border-t bg-background p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex gap-2 items-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "textarea",
        {
          placeholder: "Type your message...",
          className: "w-full min-h-[44px] max-h-[120px] resize-none border rounded-md p-2",
          rows: 1
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          className: "h-11 w-11 bg-blue-500 text-white rounded-md flex items-center justify-center",
          disabled: true,
          children: "Send"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "mt-2 text-xs text-gray-500", children: "Message input placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/conversation-header.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ConversationHeader() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "border-b bg-background p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-sm font-medium", children: "JD" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h3", { className: "font-semibold", children: "John Doe" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { className: "text-sm text-gray-500", children: "john.doe@example.com" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: "Open" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: "p-2 hover:bg-gray-100 rounded-md", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-gray-500", children: "\u22EF" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "mt-4 text-xs text-gray-500", children: "Conversation header placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/conversation-view.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function ConversationView() {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "w-1/3 border-r", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "p-4 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "text-lg font-semibold", children: "Conversations" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-3 border rounded-lg bg-blue-50", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "font-medium", children: "Active Conversation" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "p-3 border rounded-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "font-medium", children: "Another Conversation" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-sm text-gray-500", children: "Last message preview..." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "p-4 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h3", { className: "font-semibold", children: "Conversation with Customer" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex-1 p-4 space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex justify-start", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "max-w-xs bg-gray-100 rounded-lg p-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-sm", children: "Hello! How can I help you today?" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: "10:30 AM" })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "max-w-xs bg-blue-500 text-white rounded-lg p-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-sm", children: "I need help with my account" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "text-xs text-blue-100 mt-1", children: "10:32 AM" })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "border-t p-4", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            type: "text",
            placeholder: "Type your message...",
            className: "flex-1 border rounded-md p-2"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { className: "bg-blue-500 text-white px-4 py-2 rounded-md", children: "Send" })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "absolute bottom-4 right-4 text-xs text-gray-500", children: "Conversation view placeholder - React 19 compatibility pending" })
  ] });
}

// src/hooks/use-conversations.ts
var import_react_query = require("@tanstack/react-query");
var import_react = require("react");
function useConversations(accountId) {
  return (0, import_react_query.useQuery)({
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
  return (0, import_react_query.useQuery)({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      return null;
    },
    enabled: !!conversationId
  });
}
function useCreateConversation() {
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
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
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
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
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
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
  const queryClient = (0, import_react_query.useQueryClient)();
  (0, import_react.useEffect)(() => {
    if (!accountId) return;
    console.log("Realtime conversations placeholder for account:", accountId);
    return () => {
    };
  }, [accountId, queryClient]);
}

// src/hooks/use-messages.ts
var import_react_query2 = require("@tanstack/react-query");
var import_react2 = require("react");
function useMessages(conversationId) {
  return (0, import_react_query2.useQuery)({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return [];
    },
    enabled: !!conversationId,
    staleTime: 0
  });
}
function useCreateMessage() {
  const queryClient = (0, import_react_query2.useQueryClient)();
  return (0, import_react_query2.useMutation)({
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
  const queryClient = (0, import_react_query2.useQueryClient)();
  (0, import_react2.useEffect)(() => {
    if (!conversationId) return;
    console.log("Realtime messages placeholder for conversation:", conversationId);
    return () => {
    };
  }, [conversationId, queryClient]);
}
function useMarkAsRead() {
  return (0, import_react_query2.useMutation)({
    mutationFn: async ({
      conversationId,
      userId
    }) => {
      console.log("Mark as read placeholder:", { conversationId, userId });
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
