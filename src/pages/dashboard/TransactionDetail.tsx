import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Clock, CheckCircle2, MessageSquare, Mail, Phone, User, Lock, Shield, Building2, Star, Search, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

interface Property {
  id: string
  address: string
  address_line1: string
  address_line2: string
  city: string
  postcode: string
  price: number
  property_type: string
  bedrooms: number
  transaction_type: string
  seller_name: string
  seller_email: string
  seller_phone: string
  status: string
  current_stage: string
  progress_percentage: number
  case_number: string
  created_at: string
  buyer_name?: string
  buyer_email?: string
  buyer_phone?: string
  buyer_invited_at?: string
  offer_accepted_at?: string
  seller_solicitor_id?: string
}

interface ConveyancerPanel {
  id: string
  firm_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  town: string
  postcode: string
  rating: number
  review_count: number
  fixed_fee: number | null
  active: boolean
}

interface ConveyancerInvite {
  id: string
  property_id: string
  conveyancer_panel_id: string | null
  conveyancer_name: string
  conveyancer_email: string
  conveyancer_firm: string | null
  conveyancer_phone: string | null
  status: string
  invited_at: string
}

const defaultMilestones = [
  { name: 'Instruction Received', description: 'You have been formally instructed to act. Ensure your agency agreement is signed, fees are agreed, and all client details are on file.', owner: 'agent', action: 'Mark as Instructed' },
  { name: 'Offer Accepted', description: 'A buyer has been found and their offer accepted. Enter the buyer details and invite them to Documove so they can choose or bring their own conveyancer.', owner: 'agent', action: 'Invite Buyer' },
  { name: 'ID Verification', description: 'Anti-money laundering checks must be completed for all parties. Collect photo ID and proof of address before any further steps.', owner: 'conveyancer', action: 'Request ID Documents' },
  { name: 'Searches Ordered', description: 'Local authority, water, drainage and environmental searches have been submitted. Results typically take 2-6 weeks depending on the local council.', owner: 'conveyancer', action: 'Confirm Searches Ordered' },
  { name: 'Search Results', description: 'All search results have been received and reviewed. Any issues such as planning restrictions or flood risk should be flagged to the buyer now.', owner: 'conveyancer', action: 'Mark Results Received' },
  { name: 'Contract Pack Sent', description: 'The draft contract, title deeds and property information forms have been sent to the buyer\'s solicitor for review.', owner: 'conveyancer', action: 'Confirm Pack Sent' },
  { name: 'Enquiries Raised', description: 'The buyer\'s solicitor has raised legal questions about the property. Responses from your seller are needed promptly to avoid delays.', owner: 'conveyancer', action: 'Log Enquiry Response' },
  { name: 'Mortgage Offer', description: 'The buyer\'s mortgage lender has issued a formal offer. The buyer\'s solicitor will now review the offer conditions before proceeding.', owner: 'conveyancer', action: 'Confirm Offer Received' },
  { name: 'Exchange of Contracts', description: 'Both parties have signed and exchanged contracts. The sale is now legally binding and a completion date has been agreed.', owner: 'both', action: 'Confirm Exchange' },
  { name: 'Completion', description: 'Funds have been transferred and keys handed over. The property has legally changed hands. Congratulations!', owner: 'both', action: 'Mark Complete' },
]

export default function TransactionDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [userRole, setUserRole] = useState<string>('agent')
  const [conveyancerPanel, setConveyancerPanel] = useState<ConveyancerPanel[]>([])
  const [conveyancerInvite, setConveyancerInvite] = useState<ConveyancerInvite | null>(null)
  const [showConveyancerPicker, setShowConveyancerPicker] = useState(false)
  const [conveyancerSearch, setConveyancerSearch] = useState('')
  const [invitingConveyancer, setInvitingConveyancer] = useState(false)

  useEffect(() => {
    fetchProperty()
    fetchConveyancerPanel()
    if (user) fetchUserRole()
    if (id) fetchConveyancerInvite()
  }, [id, user])

  const fetchUserRole = async () => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (data) setUserRole(data.role || 'agent')
  }

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      if (!error && data) setProperty(data)
    } catch (err) {
      console.error('Error fetching property:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchConveyancerPanel = async () => {
    const { data } = await supabase
      .from('conveyancer_panel')
      .select('*')
      .eq('active', true)
      .order('rating', { ascending: false })
    if (data) setConveyancerPanel(data)
  }

  const fetchConveyancerInvite = async () => {
    const { data } = await supabase
      .from('conveyancer_invites')
      .select('*')
      .eq('property_id', id)
      .order('invited_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (data) setConveyancerInvite(data)
  }

  const handleInviteConveyancer = async (c: ConveyancerPanel) => {
    if (!property || !user) return
    setInvitingConveyancer(true)
    try {
      const { error } = await supabase.from('conveyancer_invites').insert({
        property_id: property.id,
        conveyancer_panel_id: c.id,
        conveyancer_name: c.contact_name,
        conveyancer_email: c.email,
        conveyancer_firm: c.firm_name,
        conveyancer_phone: c.phone,
        status: 'pending',
        invited_by: user.id,
      })
      if (!error) {
        await fetchConveyancerInvite()
        setShowConveyancerPicker(false)
      }
    } catch (err) {
      console.error('Error inviting conveyancer:', err)
    } finally {
      setInvitingConveyancer(false)
    }
  }

  const canComplete = (milestone: typeof defaultMilestones[0]) => {
    if (milestone.owner === 'both') return true
    if (milestone.owner === 'agent' && userRole === 'agent') return true
    if (milestone.owner === 'conveyancer' && (userRole === 'solicitor' || userRole === 'conveyancer')) return true
    return false
  }

  const getRoleLabel = (owner: string) => {
    if (owner === 'agent') return 'Agent'
    if (owner === 'both') return 'Agent & Conveyancer'
    return 'Conveyancer'
  }

  const getRoleBadgeStyle = (owner: string) => {
    if (owner === 'agent') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    if (owner === 'both') return 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
  }

  const getActionBtnStyle = (owner: string) => {
    if (owner === 'agent') return 'bg-blue-600 text-white hover:bg-blue-700'
    if (owner === 'both') return 'bg-purple-600 text-white hover:bg-purple-700'
    return 'bg-orange-500 text-white hover:bg-orange-600'
  }

  const handleInviteSeller = async () => {
    if (!property || !property.seller_email) return
    setInviteLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      setInviteSuccess(true)
    } catch (err) {
      console.error('Error inviting seller:', err)
    } finally {
      setInviteLoading(false)
    }
  }

  const handleAdvanceMilestone = async (milestoneIndex: number) => {
    if (!property) return
    const milestone = defaultMilestones[milestoneIndex]
    if (!canComplete(milestone)) return
    setAdvancing(true)
    try {
      const nextStage = milestone.name
      const newProgress = Math.round(((milestoneIndex + 1) / defaultMilestones.length) * 100)
      const { error } = await supabase
        .from('properties')
        .update({ current_stage: nextStage, progress_percentage: newProgress })
        .eq('id', property.id)
      if (!error) {
        setProperty({ ...property, current_stage: nextStage, progress_percentage: newProgress })
      }
    } catch (err) {
      console.error('Error advancing milestone:', err)
    } finally {
      setAdvancing(false)
    }
  }

  const filteredConveyancers = conveyancerPanel.filter(c =>
    (c.contact_name || '').toLowerCase().includes(conveyancerSearch.toLowerCase()) ||
    (c.firm_name || '').toLowerCase().includes(conveyancerSearch.toLowerCase()) ||
    (c.town || '').toLowerCase().includes(conveyancerSearch.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading property details...</div></div>

  if (!property) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <p className="text-gray-500">Property not found</p>
      <Link to="/dashboard/transactions" className="text-accent hover:underline">Back to Properties</Link>
    </div>
  )

  const progress = property.progress_percentage || 5
  const completedSteps = property.current_stage ? defaultMilestones.findIndex(m => m.name === property.current_stage) + 1 : 0

  return (
    <div className="space-y-6">
      <Link to="/dashboard/transactions" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Properties
      </Link>

      {/* Header */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{property.address_line1 || property.address}</h1>
            <p className="text-gray-400 mt-1">{property.city} {property.postcode} {property.case_number ? `\u00b7 ${property.case_number}` : ''}</p>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${progress >= 80 ? 'bg-green-500/20 text-green-400' : progress >= 40 ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>{property.current_stage || property.status || 'Active'}</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-400">Progress</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${progress >= 80 ? 'bg-green-500' : progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-medium text-white">{progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">

          {/* Property Details */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Address</p><p className="text-sm text-white">{property.address_line1}{property.address_line2 ? `, ${property.address_line2}` : ''}, {property.city} {property.postcode}</p></div>
              <div><p className="text-xs text-gray-500">Asking Price</p><p className="text-sm text-white font-semibold">{`\u00a3`}{Number(property.price || 0).toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Property Type</p><p className="text-sm text-white">{property.property_type || 'N/A'}</p></div>
              <div><p className="text-xs text-gray-500">Bedrooms</p><p className="text-sm text-white">{property.bedrooms || 'N/A'}</p></div>
            </div>
          </div>

          {/* Milestones with Role Permissions */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Transaction Milestones</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400"><Shield className="w-3.5 h-3.5" /> Your role: <span className="font-medium text-white">{userRole}</span></div>
            </div>
            <div className="space-y-4">
              {defaultMilestones.map((m, i) => {
                const isCompleted = i < completedSteps
                const isCurrent = i === completedSteps
                const allowed = canComplete(m)
                return (
                  <div key={i} className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-green-500/5 border-green-500/20' : isCurrent ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-800/30 border-gray-700/30 opacity-50'}`}>
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Clock className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isCurrent ? 'text-amber-400' : 'text-gray-600'}`} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white">{m.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(m.owner)}`}>{getRoleLabel(m.owner)}</span>
                          {isCurrent && !allowed && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><Lock className="w-3 h-3" /> Not your action</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{m.description}</p>
                        {isCurrent && allowed && (
                          <button onClick={() => handleAdvanceMilestone(i)} disabled={advancing} className={`mt-3 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${getActionBtnStyle(m.owner)}`}>
                            {advancing ? 'Processing...' : m.action}
                          </button>
                        )}
                        {isCurrent && !allowed && (
                          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Waiting for {getRoleLabel(m.owner).toLowerCase()} to complete this step
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Seller */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Seller</h3>
            {property.seller_name ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300"><User className="w-4 h-4 text-gray-500" /> {property.seller_name}</div>
                {property.seller_email && <div className="flex items-center gap-2 text-sm text-gray-300"><Mail className="w-4 h-4 text-gray-500" /> {property.seller_email}</div>}
                {property.seller_phone && <div className="flex items-center gap-2 text-sm text-gray-300"><Phone className="w-4 h-4 text-gray-500" /> {property.seller_phone}</div>}
                {!inviteSuccess ? (
                  <button onClick={handleInviteSeller} disabled={inviteLoading} className="w-full mt-3 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">
                    {inviteLoading ? 'Sending Invite...' : 'Send Seller Invite'}
                  </button>
                ) : (
                  <p className="text-xs text-green-400 mt-2 text-center">Invite sent successfully</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No seller details added yet.</p>
            )}
          </div>

          {/* Conveyancer - NEW Sprint 3 */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Conveyancer</h3>
            {conveyancerInvite ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300"><User className="w-4 h-4 text-gray-500" /> {conveyancerInvite.conveyancer_name}</div>
                {conveyancerInvite.conveyancer_firm && <div className="flex items-center gap-2 text-sm text-gray-300"><Building2 className="w-4 h-4 text-gray-500" /> {conveyancerInvite.conveyancer_firm}</div>}
                <div className="flex items-center gap-2 text-sm text-gray-300"><Mail className="w-4 h-4 text-gray-500" /> {conveyancerInvite.conveyancer_email}</div>
                {conveyancerInvite.conveyancer_phone && <div className="flex items-center gap-2 text-sm text-gray-300"><Phone className="w-4 h-4 text-gray-500" /> {conveyancerInvite.conveyancer_phone}</div>}
                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    conveyancerInvite.status === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    conveyancerInvite.status === 'declined' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>{conveyancerInvite.status === 'accepted' ? 'Accepted' : conveyancerInvite.status === 'declined' ? 'Declined' : 'Invite Pending'}</span>
                </div>
                <button onClick={() => { setConveyancerInvite(null); setShowConveyancerPicker(true) }} className="w-full mt-2 border border-gray-600 text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                  Change Conveyancer
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-3">No conveyancer assigned yet.</p>
                <button onClick={() => setShowConveyancerPicker(true)} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <Building2 className="w-4 h-4" /> Choose Conveyancer
                </button>
              </div>
            )}
          </div>

          {/* Buyer */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Buyer</h3>
            {property.buyer_name ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300"><User className="w-4 h-4 text-gray-500" /> {property.buyer_name}</div>
                {property.buyer_email && <div className="flex items-center gap-2 text-sm text-gray-300"><Mail className="w-4 h-4 text-gray-500" /> {property.buyer_email}</div>}
                {property.buyer_phone && <div className="flex items-center gap-2 text-sm text-gray-300"><Phone className="w-4 h-4 text-gray-500" /> {property.buyer_phone}</div>}
                {property.buyer_invited_at ? (
                  <p className="text-xs text-green-400 mt-2">Invite sent</p>
                ) : (
                  <button className="w-full mt-3 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">Send Buyer Invite</button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Awaiting offer acceptance.</p>
            )}
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Transaction Info</h3>
            <div className="space-y-3">
              <div><p className="text-xs text-gray-500">Type</p><p className="text-sm text-white">{property.transaction_type === 'seller' ? 'Sale (Acting for Seller)' : 'Purchase (Acting for Buyer)'}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="text-sm text-white">{property.status}</p></div>
              {property.case_number && <div><p className="text-xs text-gray-500">Case Number</p><p className="text-sm text-white">{property.case_number}</p></div>}
              <div><p className="text-xs text-gray-500">Created</p><p className="text-sm text-white">{new Date(property.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/dashboard/messages" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"><MessageSquare className="w-4 h-4" /> Send Message</Link>
              <Link to="/dashboard/documents" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors"><FileText className="w-4 h-4" /> Upload Document</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conveyancer Picker Modal */}
      {showConveyancerPicker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Choose a Conveyancer</h2>
                <button onClick={() => setShowConveyancerPicker(false)} className="text-gray-400 hover:text-white text-xl">&times;</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, firm or town..."
                  value={conveyancerSearch}
                  onChange={(e) => setConveyancerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredConveyancers.map(c => (
                <div key={c.id} className="bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 hover:border-orange-500/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{c.contact_name}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" /> {c.firm_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.email}</p>
                      {c.town && <p className="text-xs text-gray-500">{c.town}{c.postcode ? `, ${c.postcode}` : ''}</p>}
                    </div>
                    <div className="text-right">
                      {c.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-white">{c.rating}</span>
                          <span className="text-xs text-gray-500">({c.review_count})</span>
                        </div>
                      )}
                      {c.fixed_fee && <p className="text-xs text-green-400 mt-1">{`\u00a3`}{c.fixed_fee.toLocaleString()}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleInviteConveyancer(c)}
                    disabled={invitingConveyancer}
                    className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {invitingConveyancer ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending...</> : 'Select & Invite'}
                  </button>
                </div>
              ))}
              {filteredConveyancers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No conveyancers found. Try a different search.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
