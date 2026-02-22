import { useState, useEffect } from 'react'
import { UserPlus, Star, Mail, Phone, Building2, MoreVertical, Search, MapPin, Award, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Conveyancer {
  id: string
  firm_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  town: string
  postcode: string
  logo_url: string | null
  rating: number
  review_count: number
  fixed_fee: number | null
  accreditations: string[]
  active: boolean
  created_at: string
}

export default function MyConveyancers() {
  const [conveyancers, setConveyancers] = useState<Conveyancer[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', firm: '' })
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetchConveyancers()
  }, [])

  async function fetchConveyancers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('conveyancer_panel')
      .select('*')
      .order('rating', { ascending: false })
    if (!error && data) {
      setConveyancers(data)
    }
    setLoading(false)
  }

  async function handleInvite() {
    if (!inviteForm.name || !inviteForm.email) return
    setInviting(true)
    const { error } = await supabase.from('conveyancer_panel').insert({
      contact_name: inviteForm.name,
      email: inviteForm.email,
      firm_name: inviteForm.firm || 'Independent',
      active: true,
      rating: 0,
      review_count: 0,
    })
    if (!error) {
      setShowInvite(false)
      setInviteForm({ name: '', email: '', firm: '' })
      fetchConveyancers()
    }
    setInviting(false)
  }

  const filtered = conveyancers.filter(c =>
    (c.contact_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.firm_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.town || '').toLowerCase().includes(searchQuery.toLowerCase())
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

      {showInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Invite a Conveyancer</h2>
            <p className="text-gray-500 text-sm mb-5">Send an invitation to a conveyancer to join your preferred panel.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
                  value={inviteForm.name}
                  onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sarah Mitchell"
                />
              </div>
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
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
              >Cancel</button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteForm.name || !inviteForm.email}
                className="flex-1 bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviting && <Loader2 className="w-4 h-4 animate-spin" />}
                {inviting ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
          placeholder="Search conveyancers by name, firm or town..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="ml-2 text-gray-500">Loading conveyancers...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{c.contact_name || c.firm_name}</h3>
                    {c.review_count === 0 && !c.rating ? (
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-medium">New</span>
                    ) : (
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{c.firm_name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>}
                  </div>
                  {c.town && (
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{[c.address, c.town, c.postcode].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {c.rating > 0 && (
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        {renderStars(c.rating)}
                        <span className="text-sm font-medium text-gray-700 ml-1">{c.rating}</span>
                        <span className="text-xs text-gray-400">({c.review_count} reviews)</span>
                      </div>
                      {c.fixed_fee && (
                        <span className="text-sm text-gray-500">Fixed fee: £{c.fixed_fee.toLocaleString()}</span>
                      )}
                    </div>
                  )}
                  {c.accreditations && c.accreditations.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="w-3.5 h-3.5 text-accent" />
                      <div className="flex gap-1.5">
                        {c.accreditations.map((a, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No conveyancers found. Invite one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
