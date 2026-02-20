import { useState } from 'react'
import { FileText, Upload, Download, Search, FolderOpen, Clock, CheckCircle2, Eye } from 'lucide-react'

const documents = [
  { id: '1', name: 'Title Deeds - 14 Maple Drive', type: 'PDF', size: '2.4 MB', category: 'Legal', transaction: '14 Maple Drive', date: '2024-01-15', status: 'Verified' },
  { id: '2', name: 'Property Information Form (TA6)', type: 'PDF', size: '1.8 MB', category: 'Forms', transaction: '14 Maple Drive', date: '2024-01-14', status: 'Verified' },
  { id: '3', name: 'Fixtures & Fittings Form (TA10)', type: 'PDF', size: '890 KB', category: 'Forms', transaction: '27 Oak Avenue', date: '2024-01-13', status: 'Pending Review' },
  { id: '4', name: 'Local Authority Search', type: 'PDF', size: '3.1 MB', category: 'Searches', transaction: '14 Maple Drive', date: '2024-01-12', status: 'Verified' },
  { id: '5', name: 'Environmental Search', type: 'PDF', size: '1.5 MB', category: 'Searches', transaction: '8 Pine Close', date: '2024-01-11', status: 'Pending Review' },
  { id: '6', name: 'Mortgage Offer Letter', type: 'PDF', size: '540 KB', category: 'Financial', transaction: '14 Maple Drive', date: '2024-01-10', status: 'Verified' },
  { id: '7', name: 'Draft Contract', type: 'PDF', size: '2.1 MB', category: 'Legal', transaction: '27 Oak Avenue', date: '2024-01-09', status: 'Awaiting Signature' },
  { id: '8', name: 'ID Verification - Passport', type: 'JPG', size: '1.2 MB', category: 'Identity', transaction: '52 Cedar Lane', date: '2024-01-08', status: 'Verified' },
]

const categories = ['All', 'Legal', 'Forms', 'Searches', 'Financial', 'Identity']

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.transaction.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Manage all your property transaction documents</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Document</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Transaction</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.type} · {d.size} · {d.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{d.transaction}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{d.category}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      {d.status === 'Verified' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        d.status === 'Verified' ? 'text-green-600' : 'text-amber-600'
                      }`}>{d.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Download">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No documents found</p>
          </div>
        )}
      </div>
    </div>
  )
}
