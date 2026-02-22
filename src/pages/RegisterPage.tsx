import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import Logo from '../components/Logo'

const roles = [
  { value: 'agent', label: 'Estate Agent', desc: 'I manage property sales and lettings' },
  { value: 'conveyancer', label: 'Conveyancer / Solicitor', desc: 'I handle legal property transfers' },
]

export default function RegisterPage() {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [sraNumber, setSraNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signUp(email, password, {
      full_name: name,
      role,
      company: company || undefined,
      phone: phone || undefined,
      sra_number: role === 'conveyancer' ? sraNumber || undefined : undefined,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-gray-600">We've sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.</p>
          <Link to="/login" className="mt-6 inline-block text-accent font-medium hover:underline">Back to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          <Logo variant="dark" size="lg" />
          <p className="mt-4 text-lg text-white/80">Join thousands of professionals using documove to simplify property transactions.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-white/70 text-sm">Create properties and invite buyers, sellers & conveyancers</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-white/70 text-sm">Track every transaction from instruction to completion</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-white/70 text-sm">KYC verification and secure payments built in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Logo variant="light" size="md" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Choose your role and get started</p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-3">
            {roles.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  role === r.value ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="John Smith" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="07700 900000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="Your company" required />
              </div>
              {role === 'conveyancer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SRA Number</label>
                  <input type="text" value={sraNumber} onChange={(e) => setSraNumber(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                    placeholder="e.g. 123456" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="Min. 8 characters" required minLength={8} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            Buyers and sellers are invited by their agent
          </p>
        </div>
      </div>
    </div>
  )
}
