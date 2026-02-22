import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftRight, FileText, MessageSquare, Clock, Plus, Home } from 'lucide-react'
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

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

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

  const activeCount = properties.filter(p => p.status === 'active').length
  const pendingDocs = 0
  const unreadMessages = 0

  const stats = [
    { label: 'Active Properties', value: String(activeCount), icon: ArrowLeftRight, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Documents', value: String(pendingDocs), icon: FileText, color: 'text-amber-600 bg-amber-50' },
    { label: 'Unread Messages', value: String(unreadMessages), icon: MessageSquare, color: 'text-green-600 bg-green-50' },
    { label: 'Total Properties', value: String(properties.length), icon: Clock, color: 'text-purple-600 bg-purple-50' },
  ]

  const getStageLabel = (p: Property) => {
    if (!p.seller_email) return 'Seller Invite Pending'
    if (p.current_stage) return p.current_stage
    return 'In Progress'
  }

  const getStageColor = (p: Property) => {
    if (!p.seller_email) return 'bg-amber-50 text-amber-700'
    if (p.progress_percentage >= 70) return 'bg-green-50 text-green-700'
    if (p.progress_percentage >= 40) return 'bg-blue-50 text-blue-700'
    return 'bg-amber-50 text-amber-700'
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, here's your overview.</p>
        </div>
        <Link to="/dashboard/create-property" className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors">
          <Plus className="w-4 h-4" />
          New Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Properties</h2>
          <Link to="/dashboard/transactions" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center">
            <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No properties yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first property to get started.</p>
            <Link to="/dashboard/create-property" className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium text-sm mt-4 hover:bg-accent-dark transition-colors">
              <Plus className="w-4 h-4" /> New Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {properties.slice(0, 5).map((p) => (
              <Link key={p.id} to={`/dashboard/transactions/${p.id}`} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{p.address_line1 || p.address}, {p.city} {p.postcode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.seller_name || 'No seller invited'} {p.case_number ? `\u00b7 ${p.case_number}` : ''}</p>
                </div>
                <div className="hidden sm:block text-right mr-3">
                  <p className="text-sm font-medium text-gray-900">\u00a3{Number(p.price || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{p.property_type || 'Property'}</p>
                </div>
                <div className="hidden sm:block w-24">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${p.progress_percentage || 5}%` }}></div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${getStageColor(p)}`}>{getStageLabel(p)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <Link to="/dashboard/create-property" className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow block">
          <Plus className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">New Property</p>
          <p className="text-xs text-gray-500 mt-1">Create a property and invite parties</p>
        </Link>
        <Link to="/dashboard/transactions" className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow block">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">All Properties</p>
          <p className="text-xs text-gray-500 mt-1">View and manage all transactions</p>
        </Link>
        <Link to="/dashboard/messages" className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow block">
          <MessageSquare className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">Messages</p>
          <p className="text-xs text-gray-500 mt-1">Contact transaction parties</p>
        </Link>
      </div>
    </div>
  )
}
