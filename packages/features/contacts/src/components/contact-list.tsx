'use client';

// Placeholder component to avoid build errors
// This will be replaced with a proper implementation when React 19 compatibility is resolved

export function ContactList() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contacts</h2>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            Add Contact
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          
          <div className="flex gap-2">
            <select className="flex-1 px-3 py-2 border rounded-md text-sm">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Blocked</option>
            </select>
            
            <select className="flex-1 px-3 py-2 border rounded-md text-sm">
              <option>All Sources</option>
              <option>Website</option>
              <option>Email</option>
              <option>Phone</option>
              <option>Social</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* Sample contact items */}
          {[
            { name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567' },
            { name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 (555) 234-5678' },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com', phone: '+1 (555) 345-6789' },
          ].map((contact, index) => (
            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <span className="text-gray-400">⋯</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📧</span>
                      <span className="truncate">{contact.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📞</span>
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                    <span className="text-xs text-gray-500">
                      💬 3 conversations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t text-xs text-gray-500 text-center">
        Contact list placeholder - React 19 compatibility pending
      </div>
    </div>
  );
}
