import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ChevronRight, Home, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Property {
  id: string
  address: string
  address_line1: string
  city: string
  postcode: string
  price: number
  property_type: string
  transaction_type: string
  seller_name: string
  seller_email: string
  status: string
  current_stage: string
  progress_percentage: number
  case_number: string
  created_at: string
}

const statusIcon = (p: Property) => {
  if (p.status === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (!p.seller_email) return <AlertTriangle className="w-4 h-4 text-amber-600" />
  return <Clock className="w-4 h-4 text-blue-600" />
}

const getStatusLabel = (p: Property) => {
  if (p.status === 'completed') return 'Completed'
  if (!p.seller_email) return 'Seller Invite Pending'
  if (p.current_stage) return p.current_stage
  return 'In Progress'
}

export default function Transactions() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('agent_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })

      if (!error && data) setProperties(data)
    } catch (err) {
      console.error('Error fetching properties:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = properties.filter(t => {
    const searchStr = searchQuery.toLowerCase()
    const matchesSearch = (t.address || '').toLowerCase().includes(searchStr) ||
      (t.address_line1 || '').toLowerCase().includes(searchStr) ||
      (t.seller_name || '').toLowerCase().includes(searchStr) ||
      (t.city || '').toLowerCase().includes(searchStr) ||
      (t.case_number || '').toLowerCase().includes(searchStr)
    const typeLabel = t.transaction_type === 'seller' ? 'Sale' : 'Purchase'
    const matchesFilter = filterType === 'All' || typeLabel === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your property transactions</p>
        </div>
        <Link to="/dashboard/create-property" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Property
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address, seller, city or case number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Sale', 'Purchase'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400">Loading properties...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{properties.length === 0 ? 'No properties yet' : 'No matching properties'}</p>
          <p className="text-gray-400 text-sm mt-1">{properties.length === 0 ? 'Create your first property to get started.' : 'Try adjusting your search or filters.'}</p>
          {properties.length === 0 && (
            <Link to="/dashboard/create-property" className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium text-sm mt-4 hover:bg-accent-dark transition-colors">
              <Plus className="w-4 h-4" /> New Property
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <Link key={t.id} to={`/dashboard/transactions/${t.id}`} className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{t.address_line1 || t.address}, {t.city} {t.postcode}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">{t.seller_name || 'No seller'}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-sm font-medium text-gray-900">£{Number(t.price || 0).toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.transaction_type === 'buyer' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>{t.transaction_type === 'seller' ? 'Sale' : 'Purchase'}</span>
                      {t.case_number && <span className="text-xs text-gray-400">{t.case_number}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="hidden sm:block text-right">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(t)}
                      <span className={`text-sm font-medium ${
                        t.status === 'completed' ? 'text-green-600' :
                        !t.seller_email ? 'text-amber-600' : 'text-blue-600'
                      }`}>{getStatusLabel(t)}</span>
                    </div>
                    <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-2">
                      <div className={`h-full rounded-full ${
                        (t.progress_percentage || 0) >= 80 ? 'bg-green-500' : (t.progress_percentage || 0) >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                      }`} style={{ width: `${t.progress_percentage || 5}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
