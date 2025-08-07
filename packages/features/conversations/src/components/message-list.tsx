'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function MessageList() {
  return (
    <div className="flex-1 flex flex-col">
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
        <div className="flex justify-start">
          <div className="max-w-xs bg-gray-100 rounded-lg p-3">
            <div className="text-sm">I'd be happy to help you with your account. What specific issue are you experiencing?</div>
            <div className="text-xs text-gray-500 mt-1">10:33 AM</div>
          </div>
        </div>
      </div>
      <div className="p-4 text-xs text-gray-500 text-center">
        Message list placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
