'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function ConversationHeader() {
  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-gray-500">john.doe@example.com</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Open
          </span>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <span className="text-gray-500">⋯</span>
          </button>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Conversation header placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
