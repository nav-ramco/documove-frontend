import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          <p className="mt-4 text-lg text-white/80">The digital platform for property conveyancing. Track, communicate, and complete transactions faster.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="text-2xl font-bold text-primary lg:hidden">documove</Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                placeholder="Enter your password" required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-light transition-colors">
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
