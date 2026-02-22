import { useState, useEffect } from 'react'
import { FileText, Upload, Download, Search, FolderOpen, Clock, CheckCircle2, Eye, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

interface Document {
  id: string
  property_id: string
  title: string
  description: string
  document_type: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_by: string
  visible_to_buyer: boolean
  visible_to_seller: boolean
  visible_to_agent: boolean
  requires_signature: boolean
  metadata: any
  created_at: string
  property_address?: string
}

const categories = ['All', 'Legal', 'Forms', 'Searches', 'Financial', 'Identity']

function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getDocCategory(type: string): string {
  const map: Record<string, string> = {
    title_deeds: 'Legal', contract: 'Legal', transfer: 'Legal',
    ta6: 'Forms', ta7: 'Forms', ta10: 'Forms', form: 'Forms',
    local_search: 'Searches', environmental_search: 'Searches', water_search: 'Searches',
    mortgage_offer: 'Financial', invoice: 'Financial',
    id_verification: 'Identity', passport: 'Identity', driving_licence: 'Identity',
  }
  return map[type] || 'Legal'
}

export default function Documents() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    if (!user) return
    const fetchDocuments = async () => {
      // Get transactions the user is involved in
      const { data: transactions } = await supabase
        .from('transactions')
        .select('id, property_id, properties(address_line_1, town)')
        .eq('created_by', user.id)

      if (!transactions || transactions.length === 0) {
        setLoading(false)
        return
      }

      const propertyIds = transactions.map((t: any) => t.property_id).filter(Boolean)

      const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false })

      if (docs) {
        const enriched = docs.map((d: any) => {
          const txn = transactions.find((t: any) => t.property_id === d.property_id)
          const prop = (txn as any)?.properties
          return {
            ...d,
            property_address: prop ? `${prop.address_line_1}, ${prop.town}` : 'Unknown property',
          }
        })
        setDocuments(enriched)
      }
      setLoading(false)
    }
    fetchDocuments()
  }, [user])

  const filtered = documents.filter(d => {
    const cat = getDocCategory(d.document_type)
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.property_address || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || cat === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Property</th>
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
                        <p className="text-sm font-medium text-gray-900">{d.title}</p>
                        <p className="text-xs text-gray-400">{d.mime_type || 'PDF'} · {formatFileSize(d.file_size)} · {new Date(d.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-600">{d.property_address}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{getDocCategory(d.document_type)}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {d.requires_signature ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Awaiting Signature
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors ml-1">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{documents.length === 0 ? 'No documents uploaded yet' : 'No documents found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
