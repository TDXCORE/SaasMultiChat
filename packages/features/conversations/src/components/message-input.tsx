'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function MessageInput() {
  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            placeholder="Type your message..."
            className="w-full min-h-[44px] max-h-[120px] resize-none border rounded-md p-2"
            rows={1}
          />
        </div>
        <button
          className="h-11 w-11 bg-blue-500 text-white rounded-md flex items-center justify-center"
          disabled
        >
          Send
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Message input placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
