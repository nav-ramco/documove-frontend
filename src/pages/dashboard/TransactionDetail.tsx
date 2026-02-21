import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Home, FileText, Clock, CheckCircle2, MessageSquare, Download } from 'lucide-react'

const transactionData: Record<string, any> = {
  '1': { id: '1', address: '14 Maple Drive, London SW1A 1AA', buyer: 'Sarah Johnson', seller: 'David Wilson', solicitorBuyer: 'Adams & Partners LLP', solicitorSeller: 'Baker Legal Services', status: 'Searches Ordered', progress: 35, type: 'Purchase', price: '£425,000', date: '2024-01-15', estateAgent: 'Foxtons', mortgageLender: 'Nationwide' },
  '2': { id: '2', address: '27 Oak Avenue, Manchester M1 2AB', buyer: 'James Smith', seller: 'Emily Brown', solicitorBuyer: 'Clarke & Co Solicitors', solicitorSeller: 'Douglas Law', status: 'Awaiting Contracts', progress: 55, type: 'Sale', price: '£310,000', date: '2024-01-12', estateAgent: 'Purplebricks', mortgageLender: 'Halifax' },
  '3': { id: '3', address: '8 Pine Close, Birmingham B1 3CD', buyer: 'Emma Brown', seller: 'Robert Taylor', solicitorBuyer: 'Evans & White', solicitorSeller: 'Fisher Legal', status: 'Exchange Pending', progress: 80, type: 'Purchase', price: '£275,000', date: '2024-01-10', estateAgent: 'Savills', mortgageLender: 'Barclays' },
  '4': { id: '4', address: '52 Cedar Lane, Leeds LS1 4EF', buyer: 'Michael Davis', seller: 'Lisa Anderson', solicitorBuyer: 'Grant Solicitors', solicitorSeller: 'Hughes & Partners', status: 'ID Verification', progress: 15, type: 'Sale', price: '£195,000', date: '2024-01-08', estateAgent: 'Rightmove Direct', mortgageLender: 'HSBC' },
}

const milestones = [
  { label: 'Instruction Received', completed: true },
  { label: 'ID Verification', completed: true },
  { label: 'Searches Ordered', completed: true },
  { label: 'Search Results', completed: false },
  { label: 'Contract Pack Sent', completed: false },
  { label: 'Enquiries Raised', completed: false },
  { label: 'Mortgage Offer', completed: false },
  { label: 'Exchange of Contracts', completed: false },
  { label: 'Completion', completed: false },
]

export default function TransactionDetail() {
  const { id } = useParams()
  const t = transactionData[id || '1'] || transactionData['1']

  return (
    <div>
      <Link to="/dashboard/transactions" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Transactions
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{t.address}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{t.type} · {t.price}</p>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                t.progress >= 80 ? 'bg-green-50 text-green-700' :
                t.progress >= 40 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
              }`}>{t.status}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-900">{t.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className={`h-full rounded-full transition-all ${
                  t.progress >= 80 ? 'bg-green-500' : t.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                }`} style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Transaction Milestones</h2>
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    m.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-2">
              {['Title Deeds.pdf', 'Property Info Form.pdf', 'Fixtures & Fittings.pdf', 'Search Results.pdf'].map(doc => (
                <div key={doc} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                  <button className="text-primary hover:text-primary-dark">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Parties */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Parties</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Buyer</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{t.buyer}</p>
                <p className="text-xs text-gray-500">{t.solicitorBuyer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Seller</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{t.seller}</p>
                <p className="text-xs text-gray-500">{t.solicitorSeller}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Estate Agent</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{t.estateAgent}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Mortgage Lender</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{t.mortgageLender}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4" /> Upload Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
