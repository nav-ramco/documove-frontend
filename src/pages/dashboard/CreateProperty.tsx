import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, User, Mail, Phone, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function CreateProperty() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    price: '',
    property_type: 'semi-detached',
    bedrooms: '3',
    transaction_type: 'sale',
    seller_name: '',
    seller_email: '',
    seller_phone: '',
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
  })

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      const { error: dbError } = await supabase.from('properties').insert({
        agent_id: user.id,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        postcode: form.postcode,
        price: parseFloat(form.price) || 0,
        property_type: form.property_type,
        bedrooms: parseInt(form.bedrooms) || 0,
        transaction_type: form.transaction_type,
        seller_name: form.seller_name,
        seller_email: form.seller_email,
        buyer_name: form.buyer_name,
        buyer_email: form.buyer_email,
        status: 'active',
      })
      if (dbError) throw dbError
      navigate('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Create New Property</h1>
        <p className="text-gray-500 text-sm mb-6">Add property details and invite the seller and buyer.</p>

        {/* Step indicators */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${step >= s ? 'bg-accent' : 'bg-gray-200'}`} />
              <p className={`text-xs mt-1 ${step >= s ? 'text-accent font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Property' : s === 2 ? 'Seller' : 'Buyer'}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Home className="w-4 h-4 text-accent" /> Property Details</h2>
              <div>
                <label className={labelClass}>Address Line 1 *</label>
                <input className={inputClass} required value={form.address_line1} onChange={e => update('address_line1', e.target.value)} placeholder="e.g. 14 Maple Drive" />
              </div>
              <div>
                <label className={labelClass}>Address Line 2</label>
                <input className={inputClass} value={form.address_line2} onChange={e => update('address_line2', e.target.value)} placeholder="e.g. Flat 2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City *</label>
                  <input className={inputClass} required value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. London" />
                </div>
                <div>
                  <label className={labelClass}>Postcode *</label>
                  <input className={inputClass} required value={form.postcode} onChange={e => update('postcode', e.target.value)} placeholder="e.g. SW1A 1AA" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Asking Price (\u00a3) *</label>
                  <input className={inputClass} required type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 350000" />
                </div>
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select className={inputClass} value={form.property_type} onChange={e => update('property_type', e.target.value)}>
                    <option value="detached">Detached</option>
                    <option value="semi-detached">Semi-Detached</option>
                    <option value="terraced">Terraced</option>
                    <option value="flat">Flat / Apartment</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bedrooms</label>
                  <select className={inputClass} value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)}>
                    {['1','2','3','4','5','6+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Transaction Type</label>
                  <select className={inputClass} value={form.transaction_type} onChange={e => update('transaction_type', e.target.value)}>
                    <option value="sale">Sale</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors mt-4">
                Next: Seller Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-accent" /> Seller Details</h2>
              <p className="text-xs text-gray-500">An invite will be sent to the seller to create their Documove account and manage their side of the transaction.</p>
              <div>
                <label className={labelClass}>Seller Full Name *</label>
                <input className={inputClass} required value={form.seller_name} onChange={e => update('seller_name', e.target.value)} placeholder="e.g. James Williams" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}><Mail className="w-3 h-3 inline mr-1" />Email *</label>
                  <input className={inputClass} required type="email" value={form.seller_email} onChange={e => update('seller_email', e.target.value)} placeholder="seller@email.com" />
                </div>
                <div>
                  <label className={labelClass}><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                  <input className={inputClass} value={form.seller_phone} onChange={e => update('seller_phone', e.target.value)} placeholder="07700 900000" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors">Next: Buyer Details</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-accent" /> Buyer Details</h2>
              <p className="text-xs text-gray-500">An invite will be sent to the buyer to create their Documove account and track their purchase.</p>
              <div>
                <label className={labelClass}>Buyer Full Name *</label>
                <input className={inputClass} required value={form.buyer_name} onChange={e => update('buyer_name', e.target.value)} placeholder="e.g. Sarah Johnson" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}><Mail className="w-3 h-3 inline mr-1" />Email *</label>
                  <input className={inputClass} required type="email" value={form.buyer_email} onChange={e => update('buyer_email', e.target.value)} placeholder="buyer@email.com" />
                </div>
                <div>
                  <label className={labelClass}><Phone className="w-3 h-3 inline mr-1" />Phone</label>
                  <input className={inputClass} value={form.buyer_phone} onChange={e => update('buyer_phone', e.target.value)} placeholder="07700 900000" />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-gray-900 text-sm mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-accent" /> Summary</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-900">Property:</span> {form.address_line1}, {form.city} {form.postcode}</p>
                  <p><span className="font-medium text-gray-900">Price:</span> \u00a3{Number(form.price || 0).toLocaleString()}</p>
                  <p><span className="font-medium text-gray-900">Type:</span> {form.property_type} | {form.bedrooms} bed | {form.transaction_type}</p>
                  <hr className="my-2" />
                  <p><span className="font-medium text-gray-900">Seller:</span> {form.seller_name} ({form.seller_email})</p>
                  <p><span className="font-medium text-gray-900">Buyer:</span> {form.buyer_name} ({form.buyer_email})</p>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Property & Send Invites'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
