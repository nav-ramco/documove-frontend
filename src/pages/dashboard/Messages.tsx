import { useState } from 'react'
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react'

const conversations = [
  { id: '1', name: 'Adams & Partners LLP', role: 'Solicitor (Buyer)', lastMessage: 'The search results have come back. Please review at your earliest convenience.', time: '10:34 AM', unread: 2, avatar: 'AP' },
  { id: '2', name: 'Sarah Johnson', role: 'Buyer', lastMessage: 'Thank you for the update on the property survey.', time: '9:15 AM', unread: 0, avatar: 'SJ' },
  { id: '3', name: 'Baker Legal Services', role: 'Solicitor (Seller)', lastMessage: 'We have raised some additional enquiries regarding the boundary.', time: 'Yesterday', unread: 1, avatar: 'BL' },
  { id: '4', name: 'David Wilson', role: 'Seller', lastMessage: 'When can we expect exchange of contracts?', time: 'Yesterday', unread: 0, avatar: 'DW' },
  { id: '5', name: 'Foxtons', role: 'Estate Agent', lastMessage: 'The buyer has requested a second viewing before exchange.', time: 'Mon', unread: 0, avatar: 'FX' },
]

const messages = [
  { id: '1', sender: 'Adams & Partners LLP', content: 'Good morning. We have received the local authority search results for 14 Maple Drive.', time: '10:20 AM', isOwn: false },
  { id: '2', sender: 'You', content: 'Thank you. Are there any issues flagged in the results?', time: '10:25 AM', isOwn: true },
  { id: '3', sender: 'Adams & Partners LLP', content: 'There is a minor planning application noted for a neighbouring property. Nothing that should affect the transaction, but I wanted to bring it to your attention.', time: '10:30 AM', isOwn: false },
  { id: '4', sender: 'Adams & Partners LLP', content: 'The search results have come back. Please review at your earliest convenience.', time: '10:34 AM', isOwn: false },
]

export default function Messages() {
  const [selectedConvo, setSelectedConvo] = useState('1')
  const [newMessage, setNewMessage] = useState('')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Communicate with parties involved in your transactions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-80 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConvo(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedConvo === c.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{c.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{c.role}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center flex-shrink-0">{c.unread}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{conversations.find(c => c.id === selectedConvo)?.name}</p>
                <p className="text-xs text-gray-500">{conversations.find(c => c.id === selectedConvo)?.role} · 14 Maple Drive</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                    m.isOwn
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p>{m.content}</p>
                    <p className={`text-xs mt-1 ${m.isOwn ? 'text-white/70' : 'text-gray-400'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
