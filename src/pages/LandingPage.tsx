import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Clock, FileCheck, Users, Building2, Scale, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center h-16">
              <Logo size="sm" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-primary">Features</a>
              <a href="#agents" className="text-sm text-gray-600 hover:text-primary">Estate Agents</a>
              <a href="#conveyancers" className="text-sm text-gray-600 hover:text-primary">Conveyancers</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-primary">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary">Sign In</Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Property transactions,<br />
            <span className="text-primary">simplified.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            The digital platform connecting estate agents, conveyancers, buyers and sellers. Streamline every step from offer to completion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-primary-light transition-colors">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-lg text-base font-semibold hover:border-primary hover:text-primary transition-colors">
              See How It Works
            </a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No setup fees</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 14-day free trial</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need in one place</h2>
            <p className="mt-4 text-lg text-gray-600">Replace scattered emails, calls, and paperwork with a single platform.</p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ArrowRight, title: 'Transaction Tracking', desc: 'Real-time visibility into every stage of the conveyancing process.' },
              { icon: FileCheck, title: 'Digital Signing', desc: 'Secure document signing built right into the platform.' },
              { icon: Shield, title: 'Secure Messaging', desc: 'Encrypted communications between all transaction parties.' },
              { icon: Clock, title: 'Faster Completions', desc: 'Reduce average completion times with automated workflows.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estate Agents Section */}
      <section id="agents" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Building2 className="w-4 h-4" /> For Estate Agents
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Keep your clients informed, automatically</h2>
              <p className="mt-4 text-gray-600">No more chasing conveyancers for updates. Get real-time progress on every transaction and keep your buyers and sellers in the loop.</p>
              <ul className="mt-8 space-y-4">
                {['Dashboard view of all active transactions', 'Instant notifications when milestones are reached', 'Direct messaging with conveyancers', 'Share progress updates with clients automatically'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Start managing transactions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Building2 className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm">Agent Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conveyancers Section */}
      <section id="conveyancers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gray-100 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center order-2 lg:order-1">
              <div className="text-center text-gray-400">
                <Scale className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm">Conveyancer Dashboard Preview</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <Scale className="w-4 h-4" /> For Conveyancers
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Manage your caseload with ease</h2>
              <p className="mt-4 text-gray-600">Digitise your workflow, collect documents, manage searches and keep all parties updated from one centralised platform.</p>
              <ul className="mt-8 space-y-4">
                {['Structured case management workflow', 'Digital document collection and ID verification', 'Integrated search ordering and tracking', 'Automated client updates at each milestone'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Streamline your practice <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buyers & Sellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            <Users className="w-4 h-4" /> For Buyers & Sellers
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Finally, clarity in your property transaction</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">No more wondering where things stand. Track your purchase or sale in real-time, sign documents digitally, and message your team securely.</p>
          <div className="mt-12 grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { title: 'Track Progress', desc: 'See exactly where your transaction is at any time.' },
              { title: 'Sign Documents', desc: 'Review and sign legal documents from any device.' },
              { title: 'Stay Connected', desc: 'Message your agent and solicitor in one place.' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to transform your property transactions?</h2>
          <p className="mt-4 text-lg text-white/80">Join the platform that makes conveyancing faster, clearer, and more connected.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">&copy; 2025 documove.co.uk. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
