import { useState, useEffect, useRef } from 'react'
import { Search, Send, Paperclip, MoreVertical, Loader2, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

interface Message {
  id: string
  property_id: string
  sender_id: string
  topic: string
  content: string
  created_at: string
  read_by: string[]
  sender_name?: string
}

interface Thread {
  property_id: string
  property_address: string
  lastMessage: string
  lastTime: string
  unread: number
  avatar: string
}

export default function Messages() {
  const { user } = useAuth()
  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    const fetchThreads = async () => {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, property_id, properties(address_line_1, town)')
        .eq('created_by', user.id)

      if (!transactions || transactions.length === 0) {
        setLoading(false)
        return
      }

      const propertyIds = transactions.map((t: any) => t.property_id).filter(Boolean)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })

      if (msgs) {
        const threadMap = new Map<string, Thread>()
        for (const m of msgs) {
          if (!threadMap.has(m.property_id)) {
            const txn = transactions.find((t: any) => t.property_id === m.property_id)
            const prop = (txn as any)?.properties
            const addr = prop ? `${prop.address_line_1}, ${prop.town}` : 'Transaction'
            threadMap.set(m.property_id, {
              property_id: m.property_id,
              property_address: addr,
              lastMessage: m.content,
              lastTime: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: msgs.filter((x: any) => x.property_id === m.property_id && !(x.read_by || []).includes(user.id)).length,
              avatar: addr.slice(0, 2).toUpperCase(),
            })
          }
        }
        const threadList = Array.from(threadMap.values())
        setThreads(threadList)
        if (threadList.length > 0) {
          setSelectedThread(threadList[0].property_id)
        }
      }
      setLoading(false)
    }
    fetchThreads()
  }, [user])

  // Fetch messages for selected thread
  useEffect(() => {
    if (!selectedThread || !user) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('property_id', selectedThread)
        .order('created_at', { ascending: true })
      if (data) {
        setMessages(data)
        // Mark as read
        const unread = data.filter((m: any) => !(m.read_by || []).includes(user.id))
        for (const m of unread) {
          await supabase
            .from('messages')
            .update({ read_by: [...(m.read_by || []), user.id] })
            .eq('id', m.id)
        }
      }
    }
    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`messages-${selectedThread}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `property_id=eq.${selectedThread}` }, (payload: any) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedThread, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !user || sending) return
    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert({
        property_id: selectedThread,
        sender_id: user.id,
        content: newMessage.trim(),
        topic: 'general',
        read_by: [user.id],
        sender_name: user.email?.split('@')[0] || 'User'
      })
      if (!error) setNewMessage('')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    )
  }

  const currentThread = threads.find(t => t.property_id === selectedThread)

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-900">
      {/* Thread List */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
            </div>
          ) : (
            threads.map(thread => (
              <div
                key={thread.property_id}
                onClick={() => setSelectedThread(thread.property_id)}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                  selectedThread === thread.property_id ? 'bg-gray-800 border-l-2 border-l-[#D4AF37]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-sm font-bold flex-shrink-0">
                  {thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-white truncate">{thread.property_address}</p>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{thread.lastTime}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1">{thread.lastMessage}</p>
                </div>
                {thread.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {thread.unread}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Panel */}
      <div className="flex-1 flex flex-col">
        {selectedThread && currentThread ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-sm font-bold">
                  {currentThread.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{currentThread.property_address}</p>
                  <p className="text-xs text-gray-400">Property conversation</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMe ? 'bg-[#D4AF37] text-black' : 'bg-gray-800 text-white'
                      }`}>
                        {!isMe && (
                          <p className="text-xs font-medium text-[#D4AF37] mb-1">{msg.sender_name || 'Unknown'}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="p-2 bg-[#D4AF37] hover:bg-[#C4A030] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                  ) : (
                    <Send className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a conversation</p>
              <p className="text-sm mt-1">Choose a property thread to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
