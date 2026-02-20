import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const roles = [
  { value: 'buyer', label: 'Buyer / Seller', desc: 'I am buying or selling a property' },
  { value: 'agent', label: 'Estate Agent', desc: 'I manage property sales and lettings' },
  { value: 'conveyancer', label: 'Conveyancer / Solicitor', desc: 'I handle legal property transfers' },
]

export default function RegisterPage() {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold">documove</h1>
          <p className="mt-4 text-lg text-white/80">Join thousands of professionals and homebuyers using documove to simplify property transactions.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="text-2xl font-bold text-primary lg:hidden">documove</Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Choose your role and get started</p>

          {/* Role Selection */}
          <div className="mt-6 grid gap-3">
            {roles.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  role === r.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                <p className="font-medium text-gray-900 text-sm">{r.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          {role && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="John Doe" required />
              </div>
              {role !== 'buyer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Your company" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Min 8 characters" required />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-light transition-colors">
                Create Account
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
