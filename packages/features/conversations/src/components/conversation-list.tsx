'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function ConversationList() {
  return (
    <div className="h-full border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <div className="p-3 border rounded-lg">
            <div className="font-medium">Sample Conversation 1</div>
            <div className="text-sm text-gray-500">Last message preview...</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium">Sample Conversation 2</div>
            <div className="text-sm text-gray-500">Last message preview...</div>
          </div>
        </div>
      </div>
      <div className="p-4 text-xs text-gray-500">
        Conversation list placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
