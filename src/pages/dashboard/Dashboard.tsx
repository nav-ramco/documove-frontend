import { Link } from 'react-router-dom'
import { ArrowLeftRight, FileText, MessageSquare, Clock, TrendingUp, AlertCircle } from 'lucide-react'

const stats = [
  { label: 'Active Transactions', value: '12', icon: ArrowLeftRight, color: 'text-blue-600 bg-blue-50' },
  { label: 'Pending Documents', value: '5', icon: FileText, color: 'text-amber-600 bg-amber-50' },
  { label: 'Unread Messages', value: '8', icon: MessageSquare, color: 'text-green-600 bg-green-50' },
  { label: 'Avg. Completion', value: '42d', icon: Clock, color: 'text-purple-600 bg-purple-50' },
]

const recentTransactions = [
  { id: '1', address: '14 Maple Drive, London SW1A 1AA', status: 'Searches Ordered', buyer: 'Sarah Johnson', progress: 45 },
  { id: '2', address: '27 Oak Avenue, Manchester M1 2AB', status: 'Awaiting Contracts', buyer: 'James Williams', progress: 30 },
  { id: '3', address: '8 Pine Close, Birmingham B1 3CD', status: 'Exchange Pending', buyer: 'Emma Brown', progress: 80 },
  { id: '4', address: '52 Cedar Lane, Leeds LS1 4EF', status: 'ID Verification', buyer: 'Michael Davis', progress: 15 },
]

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, here's your overview.</p>
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/dashboard/transactions" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentTransactions.map((t) => (
            <Link key={t.id} to={`/dashboard/transactions/${t.id}`} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{t.address}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.buyer}</p>
              </div>
              <div className="hidden sm:block w-32">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${t.progress}%` }}></div>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                t.progress >= 70 ? 'bg-green-50 text-green-700' :
                t.progress >= 40 ? 'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'
              }`}>{t.status}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <button className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow">
          <TrendingUp className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">New Transaction</p>
          <p className="text-xs text-gray-500 mt-1">Start a new property transaction</p>
        </button>
        <button className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow">
          <MessageSquare className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">Send Message</p>
          <p className="text-xs text-gray-500 mt-1">Contact a transaction party</p>
        </button>
        <button className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow">
          <AlertCircle className="w-6 h-6 text-primary" />
          <p className="font-medium text-gray-900 mt-3 text-sm">Action Required</p>
          <p className="text-xs text-gray-500 mt-1">3 items need your attention</p>
        </button>
      </div>
    </div>
  )
}
