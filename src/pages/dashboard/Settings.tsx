import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Building2, Mail, Phone, MapPin } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'company', label: 'Company', icon: Building2 },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-56">
          <nav className="bg-white rounded-xl border border-gray-100 p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">JD</div>
                <div>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark">Change photo</button>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" defaultValue="john.doe@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" defaultValue="+44 7700 900000" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea defaultValue="123 High Street, London, SW1A 1AA" rows={3} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { title: 'Transaction Updates', desc: 'Get notified when there are updates to your transactions' },
                  { title: 'New Messages', desc: 'Receive notifications for new messages from solicitors and parties' },
                  { title: 'Document Uploads', desc: 'Be notified when new documents are uploaded' },
                  { title: 'Milestone Completions', desc: 'Get alerts when transaction milestones are completed' },
                  { title: 'Marketing Communications', desc: 'Receive news and updates from documove' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button className={`w-11 h-6 rounded-full transition-colors relative ${
                      i < 4 ? 'bg-primary' : 'bg-gray-300'
                    }`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        i < 4 ? 'right-0.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                  <div className="mt-3 space-y-3">
                    <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="password" placeholder="New password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Update Password</button>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                  <button className="mt-3 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Professional Plan</p>
                    <p className="text-xs text-gray-500 mt-0.5">£49/month · Next billing date: 15 Feb 2024</p>
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark">Manage Plan</button>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Payment History</h3>
              <div className="space-y-2">
                {['15 Jan 2024', '15 Dec 2023', '15 Nov 2023'].map(date => (
                  <div key={date} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-900">Professional Plan</p>
                      <p className="text-xs text-gray-400">{date}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">£49.00</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" defaultValue="Doe Property Services Ltd" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SRA Number</label>
                  <input type="text" defaultValue="123456" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Registration</label>
                  <input type="text" defaultValue="12345678" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
