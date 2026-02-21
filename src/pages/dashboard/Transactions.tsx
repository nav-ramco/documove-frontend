import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ChevronRight, Home, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

const transactions = [
  { id: '1', address: '14 Maple Drive, London SW1A 1AA', buyer: 'Sarah Johnson', seller: 'David Wilson', status: 'Searches Ordered', progress: 35, type: 'Purchase', price: '£425,000', date: '2024-01-15' },
  { id: '2', address: '27 Oak Avenue, Manchester M1 2AB', buyer: 'James Smith', seller: 'Emily Brown', status: 'Awaiting Contracts', progress: 55, type: 'Sale', price: '£310,000', date: '2024-01-12' },
  { id: '3', address: '8 Pine Close, Birmingham B1 3CD', buyer: 'Emma Brown', seller: 'Robert Taylor', status: 'Exchange Pending', progress: 80, type: 'Purchase', price: '£275,000', date: '2024-01-10' },
  { id: '4', address: '52 Cedar Lane, Leeds LS1 4EF', buyer: 'Michael Davis', seller: 'Lisa Anderson', status: 'ID Verification', progress: 15, type: 'Sale', price: '£195,000', date: '2024-01-08' },
  { id: '5', address: '3 Birch Road, Bristol BS1 5GH', buyer: 'Oliver White', seller: 'Sophie Harris', status: 'Completed', progress: 100, type: 'Purchase', price: '£550,000', date: '2023-12-20' },
  { id: '6', address: '91 Elm Street, Liverpool L1 6IJ', buyer: 'Charlotte Green', seller: 'Thomas Clark', status: 'Mortgage Offer', progress: 45, type: 'Purchase', price: '£380,000', date: '2024-01-05' },
]

const statusIcon = (status: string) => {
  if (status === 'Completed') return <CheckCircle2 className="w-4 h-4 text-green-600" />
  if (status === 'ID Verification') return <AlertTriangle className="w-4 h-4 text-amber-600" />
  return <Clock className="w-4 h-4 text-blue-600" />
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  const filtered = transactions.filter(t => {
    const matchesSearch = t.address.toLowerCase().includes(searchQuery.toLowerCase()) || t.buyer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'All' || t.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage your property transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Transaction
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address, buyer or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Purchase', 'Sale'].map(type => (
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

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.map(t => (
          <Link key={t.id} to={`/dashboard/transactions/${t.id}`} className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{t.address}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">{t.buyer}</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-sm font-medium text-gray-900">{t.price}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      t.type === 'Purchase' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                    }`}>{t.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center gap-1.5">
                    {statusIcon(t.status)}
                    <span className={`text-sm font-medium ${
                      t.status === 'Completed' ? 'text-green-600' :
                      t.status === 'ID Verification' ? 'text-amber-600' : 'text-blue-600'
                    }`}>{t.status}</span>
                  </div>
                  <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-2">
                    <div className={`h-full rounded-full ${
                      t.progress >= 80 ? 'bg-green-500' : t.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                    }`} style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}
    </div>
  )
}
