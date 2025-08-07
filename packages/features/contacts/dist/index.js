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
  ContactDetails: () => ContactDetails,
  ContactList: () => ContactList,
  useContact: () => useContact,
  useContacts: () => useContacts,
  useCreateContact: () => useCreateContact,
  useDeleteContact: () => useDeleteContact,
  useRealtimeContacts: () => useRealtimeContacts,
  useUpdateContact: () => useUpdateContact
});
module.exports = __toCommonJS(index_exports);

// src/components/contact-list.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function ContactList() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 border-b", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-lg font-semibold", children: "Contacts" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "px-3 py-1 bg-blue-600 text-white rounded-md text-sm", children: "Add Contact" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", children: "\u{1F50D}" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "text",
              placeholder: "Search contacts...",
              className: "w-full pl-10 pr-4 py-2 border rounded-md"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "flex-1 px-3 py-2 border rounded-md text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Statuses" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Active" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Inactive" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Blocked" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "flex-1 px-3 py-2 border rounded-md text-sm", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Sources" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Website" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Email" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Phone" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Social" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 space-y-3", children: [
      { name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567" },
      { name: "Jane Smith", email: "jane.smith@example.com", phone: "+1 (555) 234-5678" },
      { name: "Bob Johnson", email: "bob.johnson@example.com", phone: "+1 (555) 345-6789" }
    ].map((contact, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 border rounded-lg hover:bg-gray-50 cursor-pointer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-medium", children: contact.name.split(" ").map((n) => n[0]).join("") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-medium truncate", children: contact.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: "p-1 hover:bg-gray-100 rounded", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\u22EF" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1 mt-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4E7}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "truncate", children: contact.email })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u{1F4DE}" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: contact.phone })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full", children: "Active" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-gray-500", children: "\u{1F4AC} 3 conversations" })
        ] })
      ] })
    ] }) }, index)) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 border-t text-xs text-gray-500 text-center", children: "Contact list placeholder - React 19 compatibility pending" })
  ] });
}

// src/components/contact-details.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function ContactDetails() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "p-6 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-4 mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-lg font-medium", children: "JD" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { className: "text-2xl font-bold", children: "John Doe" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-gray-600", children: "john.doe@example.com" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bg-white border rounded-lg p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Contact Information" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "space-y-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-gray-500", children: "\u{1F4E7}" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "john.doe@example.com" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-gray-500", children: "\u{1F4DE}" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "+1 (555) 123-4567" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-gray-500", children: "\u{1F4CD}" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "New York, NY" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bg-white border rounded-lg p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Recent Conversations" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "p-3 border rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "font-medium", children: "Support Request" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-sm text-gray-500", children: "2 hours ago" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "p-3 border rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "font-medium", children: "General Inquiry" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-sm text-gray-500", children: "1 day ago" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "bg-white border rounded-lg p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Notes" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-gray-600", children: "No notes available." })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "mt-6 text-xs text-gray-500 text-center", children: "Contact details placeholder - React 19 compatibility pending" })
  ] });
}

// src/hooks/use-contacts.ts
var import_react_query = require("@tanstack/react-query");
var import_react = require("react");
function useContacts(accountId) {
  return (0, import_react_query.useQuery)({
    queryKey: ["contacts", accountId],
    queryFn: async () => {
      return [];
    },
    enabled: !!accountId,
    staleTime: 3e4
    // 30 seconds
  });
}
function useContact(contactId) {
  return (0, import_react_query.useQuery)({
    queryKey: ["contact", contactId],
    queryFn: async () => {
      return null;
    },
    enabled: !!contactId
  });
}
function useCreateContact() {
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
    mutationFn: async (payload) => {
      return {
        id: "placeholder",
        account_id: payload.account_id,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        status: "active",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", data.account_id]
      });
    }
  });
}
function useUpdateContact() {
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
    mutationFn: async ({
      contactId,
      updates
    }) => {
      console.log("Update contact placeholder:", { contactId, updates });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contact", variables.contactId]
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts"]
      });
    }
  });
}
function useDeleteContact() {
  const queryClient = (0, import_react_query.useQueryClient)();
  return (0, import_react_query.useMutation)({
    mutationFn: async (contactId) => {
      console.log("Delete contact placeholder:", contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"]
      });
    }
  });
}
function useRealtimeContacts(accountId) {
  const queryClient = (0, import_react_query.useQueryClient)();
  (0, import_react.useEffect)(() => {
    if (!accountId) return;
    console.log("Realtime contacts placeholder for account:", accountId);
    return () => {
    };
  }, [accountId, queryClient]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ContactDetails,
  ContactList,
  useContact,
  useContacts,
  useCreateContact,
  useDeleteContact,
  useRealtimeContacts,
  useUpdateContact
});
