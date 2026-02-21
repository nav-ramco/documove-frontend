import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import Logo from '../components/Logo'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const { updatePassword, session } = useAuth()

  useEffect(() => {
    // Give Supabase a moment to process the token from the URL hash
    const timer = setTimeout(() => {
      setReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await updatePassword(password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  // Show loading while Supabase processes the recovery token
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>
          <p className="text-gray-600">Setting up your password reset...</p>
        </div>
      </div>
    )
  }

  // If no session after waiting, the link may be expired
  if (!session && ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reset link expired</h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <p className="text-gray-600 mb-6">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <Link to="/forgot-password" className="inline-block w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors text-center">
              Request new reset link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Set your new password</h1>

        {success ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Your password has been updated successfully.</p>
            <p className="text-sm text-gray-500 mb-6">You can now sign in with your new password.</p>
            <Link to="/login" className="inline-block w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors text-center">
              Sign in
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <p className="text-gray-600 mb-6 text-left">
              Enter your new password below. It must be at least 8 characters long.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
