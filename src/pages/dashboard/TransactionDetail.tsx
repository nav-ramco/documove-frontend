import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Home, FileText, Clock, CheckCircle2, MessageSquare, Mail, Phone, User, Send, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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
  { name: 'Instruction Received', description: 'You have been formally instructed to act. Ensure your agency agreement is signed, fees are agreed, and all client details are on file.', owner: 'agent', action: 'Mark as Instructed' },   { name: 'Offer Accepted', description: 'A buyer has been found and their offer accepted. Enter the buyer details and invite them to Documove so they can choose or bring their own conveyancer.', owner: 'agent', action: 'Invite Buyer' },
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
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)
    const [advancing, setAdvancing] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

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
    setAdvancing(true)
    try {
      const nextStage = defaultMilestones[milestoneIndex].name
      const newProgress = Math.round(((milestoneIndex + 1) / defaultMilestones.length) * 100)
      const { error } = await supabase
        .from('properties')
        .update({
          current_stage: nextStage,
          progress_percentage: newProgress
        })
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

  if (loading) return <div className="text-center py-12"><p className="text-gray-400">Loading property details...</p></div>
  if (!property) return (
    <div className="text-center py-12">
      <p className="text-gray-500 font-medium">Property not found</p>
      <Link to="/dashboard/transactions" className="text-primary text-sm mt-2 inline-block">Back to Properties</Link>
    </div>
  )

  const progress = property.progress_percentage || 5
  const completedSteps = property.current_stage ? defaultMilestones.findIndex(m => m.name === property.current_stage) + 1 : 0

  return (
    <div>
      <Link to="/dashboard/transactions" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Properties
      </Link>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{property.address_line1 || property.address}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">{property.city} {property.postcode} {property.case_number ? `· ${property.case_number}` : ''}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${progress >= 80 ? 'bg-green-50 text-green-700' : progress >= 40 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{property.current_stage || property.status || 'Active'}</span>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className={`h-full rounded-full transition-all ${progress >= 80 ? 'bg-green-500' : progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          {/* Property Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="text-sm text-gray-900">{property.address_line1}{property.address_line2 ? `, ${property.address_line2}` : ''}, {property.city} {property.postcode}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Asking Price</p>
                <p className="text-sm text-gray-900 font-medium">£{Number(property.price || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Property Type</p>
                <p className="text-sm text-gray-900 capitalize">{property.property_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Bedrooms</p>
                <p className="text-sm text-gray-900">{property.bedrooms || 'N/A'}</p>
              </div>
            </div>
          </div>
          {/* Milestones */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Transaction Milestones</h2>
            <div className="space-y-3">
              {defaultMilestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i < completedSteps ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {i < completedSteps ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Clock className="w-3 h-3 text-gray-400" />}
                  </div>
                  <div className="flex-1"><div className="flex items-center gap-2"><span className={`text-sm ${i < completedSteps ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{m.name}</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.owner === 'agent' ? 'bg-blue-50 text-blue-600' : m.owner === 'both' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>{m.owner === 'agent' ? 'Agent' : m.owner === 'both' ? 'Agent & Conveyancer' : 'Conveyancer'}</span></div><p className="text-xs text-gray-400 mt-0.5">{m.description}</p>{i === completedSteps && <button onClick={() => handleAdvanceMilestone(i)} disabled={advancing} className={`mt-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${m.owner === 'agent' ? 'bg-blue-600 text-white hover:bg-blue-700' : m.owner === 'both' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>{advancing ? 'Processing...' : m.action}</button>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Seller */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Seller</h2>
            {property.seller_name ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-900">{property.seller_name}</span></div>
                {property.seller_email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{property.seller_email}</span></div>}
                {property.seller_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{property.seller_phone}</span></div>}
                {!inviteSuccess ? (
                  <button onClick={handleInviteSeller} disabled={inviteLoading} className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
                    <Send className="w-4 h-4" /> {inviteLoading ? 'Sending Invite...' : 'Send Seller Invite'}
                  </button>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /> Invite sent successfully</div>
                )}
              </div>
            ) : (
              <div className="text-center py-4"><p className="text-gray-400 text-sm">No seller details added yet.</p></div>
            )}
          </div>
          {/* Buyer */}               <div className="bg-white rounded-xl border border-gray-100 p-6">                 <h2 className="font-semibold text-gray-900 mb-4">Buyer</h2>                 {property.buyer_name ? (                   <div className="space-y-3">                     <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-900">{property.buyer_name}</span></div>                     {property.buyer_email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{property.buyer_email}</span></div>}                     {property.buyer_phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-600">{property.buyer_phone}</span></div>}                     {property.buyer_invited_at ? (                       <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /> Invite sent</div>                     ) : (                       <button className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"><Send className="w-4 h-4" /> Send Buyer Invite</button>                     )}                   </div>                 ) : (                   <div className="text-center py-4"><p className="text-gray-400 text-sm">Awaiting offer acceptance.</p></div>                 )}               </div>               {/* Transaction Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Transaction Info</h2>
            <div className="space-y-3">
              <div><p className="text-xs text-gray-400 uppercase tracking-wide">Type</p><p className="text-sm font-medium text-gray-900 mt-1">{property.transaction_type === 'seller' ? 'Sale (Acting for Seller)' : 'Purchase (Acting for Buyer)'}</p></div>
              <div><p className="text-xs text-gray-400 uppercase tracking-wide">Status</p><p className="text-sm font-medium text-gray-900 mt-1 capitalize">{property.status}</p></div>
              {property.case_number && <div><p className="text-xs text-gray-400 uppercase tracking-wide">Case Number</p><p className="text-sm font-medium text-gray-900 mt-1">{property.case_number}</p></div>}
              <div><p className="text-xs text-gray-400 uppercase tracking-wide">Created</p><p className="text-sm font-medium text-gray-900 mt-1">{new Date(property.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"><MessageSquare className="w-4 h-4" /> Send Message</button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"><FileText className="w-4 h-4" /> Upload Document</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
