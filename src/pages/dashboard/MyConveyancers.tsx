import { useState } from 'react'
import { UserPlus, Star, Mail, Phone, Building2, MoreVertical, Search } from 'lucide-react'

interface Conveyancer {
  id: string
  name: string
  firm: string
  email: string
  phone: string
  rating: number
  total_reviews: number
  transactions_completed: number
  status: 'active' | 'pending'
}

// Mock data - will be replaced with Supabase queries
const mockConveyancers: Conveyancer[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    firm: 'Mitchell & Partners Solicitors',
    email: 'sarah@mitchellpartners.co.uk',
    phone: '020 7946 0958',
    rating: 4.8,
    total_reviews: 24,
    transactions_completed: 67,
    status: 'active',
  },
  {
    id: '2',
    name: 'David Thompson',
    firm: 'Thompson Legal Services',
    email: 'david@thompsonlegal.co.uk',
    phone: '0161 496 0321',
    rating: 4.5,
    total_reviews: 18,
    transactions_completed: 42,
    status: 'active',
  },
  {
    id: '3',
    name: 'Emma Clarke',
    firm: 'Clarke & Associates',
    email: 'emma@clarkeassociates.co.uk',
    phone: '0121 288 4930',
    rating: 0,
    total_reviews: 0,
    transactions_completed: 0,
    status: 'pending',
  },
]

export default function MyConveyancers() {
  const [conveyancers] = useState<Conveyancer[]>(mockConveyancers)
  const [showInvite, setShowInvite] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', firm: '' })

  const filtered = conveyancers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.firm.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Conveyancers</h1>
          <p className="text-gray-500 text-sm">Manage your preferred conveyancers and invite new ones.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm"
        >
          <UserPlus className="w-4 h-4" /> Invite Conveyancer
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Invite a Conveyancer</h2>
          <p className="text-xs text-gray-500 mb-4">Send an invitation to a conveyancer to join your preferred panel.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
                value={inviteForm.name}
                onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Sarah Mitchell"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="conveyancer@lawfirm.co.uk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                <input
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
                  value={inviteForm.firm}
                  onChange={e => setInviteForm(f => ({ ...f, firm: e.target.value }))}
                  placeholder="e.g. Mitchell & Partners"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >Cancel</button>
              <button
                onClick={() => {
                  setShowInvite(false)
                  setInviteForm({ name: '', email: '', firm: '' })
                }}
                className="flex-1 bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm"
              >Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
          placeholder="Search conveyancers by name or firm..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conveyancer List */}
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{c.name}</h3>
                  {c.status === 'pending' && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Invite Pending</span>
                  )}
                  {c.status === 'active' && (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                  <Building2 className="w-3.5 h-3.5" /> {c.firm}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            {c.status === 'active' && (
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex">{renderStars(c.rating)}</div>
                  <span className="text-sm font-medium text-gray-900">{c.rating}</span>
                  <span className="text-xs text-gray-400">({c.total_reviews} reviews)</span>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{c.transactions_completed}</span> transactions completed
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conveyancers found. Invite one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
