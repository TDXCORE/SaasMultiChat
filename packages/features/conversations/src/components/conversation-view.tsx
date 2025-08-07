'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function ConversationView() {
  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div className="p-3 border rounded-lg bg-blue-50">
              <div className="font-medium">Active Conversation</div>
              <div className="text-sm text-gray-500">Last message preview...</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">Another Conversation</div>
              <div className="text-sm text-gray-500">Last message preview...</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Conversation with Customer</h3>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex justify-start">
            <div className="max-w-xs bg-gray-100 rounded-lg p-3">
              <div className="text-sm">Hello! How can I help you today?</div>
              <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-xs bg-blue-500 text-white rounded-lg p-3">
              <div className="text-sm">I need help with my account</div>
              <div className="text-xs text-blue-100 mt-1">10:32 AM</div>
            </div>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-md p-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        Conversation view placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
