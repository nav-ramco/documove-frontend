import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Home, FileText, Clock, CheckCircle2, MessageSquare, Mail, Phone, User, Send, MapPin, Lock, Shield } from 'lucide-react'
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

  useEffect(() => {
    fetchProperty()
    if (user) fetchUserRole()
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

  if (loading) return <div className="p-8 text-center text-gray-400">Loading property details...</div>

  if (!property) return (
    <div className="p-8 text-center">
      <p className="text-gray-400 mb-4">Property not found</p>
      <Link to="/dashboard/transactions" className="text-[#D4AF37] hover:underline">Back to Properties</Link>
    </div>
  )

  const progress = property.progress_percentage || 5
  const completedSteps = property.current_stage ? defaultMilestones.findIndex(m => m.name === property.current_stage) + 1 : 0

  return (
    <div className="space-y-6">
      <Link to="/dashboard/transactions" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Properties
      </Link>

      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{property.address_line1 || property.address}</h1>
            <p className="text-gray-400 mt-1">{property.city} {property.postcode} {property.case_number ? `· ${property.case_number}` : ''}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${progress >= 80 ? 'bg-green-500/20 text-green-400' : progress >= 40 ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>{property.current_stage || property.status || 'Active'}</span>
        </div>
        <div className="flex items-center gap-3">
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
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Address</p>
                <p className="text-sm text-white">{property.address_line1}{property.address_line2 ? `, ${property.address_line2}` : ''}, {property.city} {property.postcode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Asking Price</p>
                <p className="text-sm text-white font-medium">{`\u00a3`}{Number(property.price || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Property Type</p>
                <p className="text-sm text-white">{property.property_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                <p className="text-sm text-white">{property.bedrooms || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Milestones with Role Permissions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Transaction Milestones</h2>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs text-gray-400">Your role: <span className="text-[#D4AF37] font-medium capitalize">{userRole}</span></span>
              </div>
            </div>
            <div className="space-y-4">
              {defaultMilestones.map((m, i) => {
                const isCompleted = i < completedSteps
                const isCurrent = i === completedSteps
                const allowed = canComplete(m)
                return (
                  <div key={i} className={`flex gap-4 p-4 rounded-lg border transition-all ${
                    isCompleted ? 'bg-green-500/5 border-green-500/20' :
                    isCurrent ? 'bg-gray-700/50 border-[#D4AF37]/30' :
                    'bg-gray-900/50 border-gray-700/50 opacity-60'
                  }`}>
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{m.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(m.owner)}`}>{getRoleLabel(m.owner)}</span>
                        {isCurrent && !allowed && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Not your action
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{m.description}</p>
                      {isCurrent && allowed && (
                        <button
                          onClick={() => handleAdvanceMilestone(i)}
                          disabled={advancing}
                          className={`mt-3 text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${getActionBtnStyle(m.owner)}`}
                        >
                          {advancing ? 'Processing...' : m.action}
                        </button>
                      )}
                      {isCurrent && !allowed && (
                        <p className="mt-2 text-xs text-red-400/70 italic flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Waiting for {getRoleLabel(m.owner).toLowerCase()} to complete this step
                        </p>
                      )}
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
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Seller</h2>
            {property.seller_name ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">{property.seller_name}</span></div>
                {property.seller_email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">{property.seller_email}</span></div>}
                {property.seller_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">{property.seller_phone}</span></div>}
                {!inviteSuccess ? (
                  <button onClick={handleInviteSeller} disabled={inviteLoading} className="w-full mt-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium hover:bg-[#C4A030] transition-colors disabled:opacity-50">
                    {inviteLoading ? 'Sending Invite...' : 'Send Seller Invite'}
                  </button>
                ) : (
                  <p className="text-sm text-green-400 mt-2">Invite sent successfully</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No seller details added yet.</p>
            )}
          </div>

          {/* Buyer */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Buyer</h2>
            {property.buyer_name ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-white">{property.buyer_name}</span></div>
                {property.buyer_email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">{property.buyer_email}</span></div>}
                {property.buyer_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">{property.buyer_phone}</span></div>}
                {property.buyer_invited_at ? (
                  <p className="text-sm text-green-400">Invite sent</p>
                ) : (
                  <button className="w-full mt-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium hover:bg-[#C4A030] transition-colors">Send Buyer Invite</button>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Awaiting offer acceptance.</p>
            )}
          </div>

          {/* Transaction Info */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Transaction Info</h2>
            <div className="space-y-3">
              <div><p className="text-xs text-gray-400">Type</p><p className="text-sm text-white">{property.transaction_type === 'seller' ? 'Sale (Acting for Seller)' : 'Purchase (Acting for Buyer)'}</p></div>
              <div><p className="text-xs text-gray-400">Status</p><p className="text-sm text-white">{property.status}</p></div>
              {property.case_number && <div><p className="text-xs text-gray-400">Case Number</p><p className="text-sm text-white">{property.case_number}</p></div>}
              <div><p className="text-xs text-gray-400">Created</p><p className="text-sm text-white">{new Date(property.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/dashboard/messages" className="flex items-center gap-2 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
                <MessageSquare className="w-4 h-4" /> Send Message
              </Link>
              <Link to="/dashboard/documents" className="flex items-center gap-2 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors">
                <FileText className="w-4 h-4" /> Upload Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
