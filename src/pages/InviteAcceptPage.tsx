import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import Logo from '../components/Logo'

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>()

  const { signUp } = useAuth()

  const [invite, setInvite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchInvite() {
      if (!token) {
        setError('Invalid invite link')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('invites')
        .select('*, properties(address, postcode)')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (error || !data) {
        setError('This invite link is invalid or has expired.')
      } else {
        setInvite(data)
        setEmail(data.email)
        setName(data.name || '')
      }
      setLoading(false)
    }
    fetchInvite()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Create the user account
    const { error: signUpError } = await signUp(email, password, {
      full_name: name,
      role: invite.role,
      phone: phone || undefined,
      invited_by: invite.invited_by,
      invite_token: token,
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    // Mark invite as accepted
    await supabase
      .from('invites')
      .update({ status: 'accepted' })
      .eq('token', token)

    setSuccess(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your invite...</p>
        </div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Invalid Invite</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link to="/login" className="mt-6 inline-block text-accent font-medium hover:underline">Go to Sign In</Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Account created!</h2>
          <p className="mt-2 text-gray-600">Check your email to confirm your account, then sign in to view your transaction.</p>
          <Link to="/login" className="mt-6 inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors">Sign In</Link>
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
          <p className="mt-4 text-lg text-white/80">You've been invited to track your property transaction on Documove.</p>
          {invite?.properties && (
            <div className="mt-8 bg-white/10 rounded-xl p-6">
              <p className="text-white/60 text-sm uppercase tracking-wider">Property</p>
              <p className="text-white text-xl font-semibold mt-1">{invite.properties.address}</p>
              {invite.properties.postcode && (
                <p className="text-white/70 mt-1">{invite.properties.postcode}</p>
              )}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm">Your role</p>
                <p className="text-accent font-medium capitalize mt-1">{invite.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6">
            <Logo variant="light" size="md" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Set up your account to track your property transaction</p>

          {invite?.properties && (
            <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <p className="text-sm text-gray-600">Property: <strong>{invite.properties.address}</strong></p>
              <p className="text-sm text-gray-500 capitalize">Role: {invite.role}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" value={email} readOnly
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                placeholder="07700 900000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Create a password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                placeholder="Min. 8 characters" required minLength={8} />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Creating account...' : 'Create Account & View Transaction'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
