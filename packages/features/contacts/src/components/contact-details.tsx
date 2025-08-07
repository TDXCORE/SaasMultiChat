'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function ContactDetails() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-lg font-medium">JD</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">John Doe</h1>
          <p className="text-gray-600">john.doe@example.com</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📧</span>
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📞</span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📍</span>
              <span>New York, NY</span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Conversations</h2>
          <div className="space-y-2">
            <div className="p-3 border rounded-lg">
              <div className="font-medium">Support Request</div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="font-medium">General Inquiry</div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <p className="text-gray-600">No notes available.</p>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        Contact details placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
