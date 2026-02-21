import { Link } from 'react-router-dom'
import { ArrowRight, Users, Building2, Scale, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="sm" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-300 hover:text-white">Features</a>
              <a href="#agents" className="text-sm text-gray-300 hover:text-white">Estate Agents</a>
              <a href="#conveyancers" className="text-sm text-gray-300 hover:text-white">Conveyancers</a>
              <a href="#pricing" className="text-sm text-gray-300 hover:text-white">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white">Sign In</Link>
              <Link to="/register" className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Conveyancing control for UK estate agents and conveyancers
          </h1>
          <p className="mt-6 text-lg text-accent font-semibold">
            One shared dashboard for every sale
          </p>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Give buyers, sellers, estate agents, and conveyancers real-time visibility of every property transaction. Both agents and conveyancers can see live progress, reduce admin time, and handle more properties with existing teams.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-accent-dark transition-colors">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-white/10 transition-colors">
              See how it works
            </a>
          </div>
          <div className="mt-8 text-sm text-gray-400">
            No credit card required · Built for agents and conveyancers
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Documove vs spreadsheets, email and phone calls</h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: 'Less chasing', desc: 'Real-time updates mean everyone can check progress instantly \u2013 no more phone tag or waiting for email replies' },
              { icon: Building2, title: 'Clearer updates', desc: 'Everyone sees the same timeline, documents and status \u2013 no more conflicting information or missed messages' },
              { icon: Scale, title: 'Extra fee income for agents', desc: 'Earn \u00a350 from each buyer and seller when they pay conveyancing fees through Documove \u2013 free revenue for agents' },
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <f.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estate Agents Section */}
      <section id="agents" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                <Building2 className="w-4 h-4" /> For Estate Agents
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Keep your clients informed, automatically</h2>
              <p className="mt-4 text-gray-600">No more chasing conveyancers for updates. Get real-time progress on every transaction and keep your buyers and sellers in the loop.</p>
              <ul className="mt-8 space-y-4">
                {['Dashboard view of all active transactions', 'Instant notifications when milestones are reached', 'Direct messaging with conveyancers', 'Share progress updates with clients automatically'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Start managing transactions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-gray-200 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Building2 className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm">Agent Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conveyancers Section */}
      <section id="conveyancers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gray-200 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center order-2 lg:order-1">
              <div className="text-center text-gray-400">
                <Scale className="w-16 h-16 mx-auto mb-4" />
                <p className="text-sm">Conveyancer Dashboard Preview</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                <Scale className="w-4 h-4" /> For Conveyancers
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Manage your caseload with ease</h2>
              <p className="mt-4 text-gray-600">Digitise your workflow, collect documents, manage searches and keep all parties updated from one centralised platform.</p>
              <ul className="mt-8 space-y-4">
                {['Structured case management workflow', 'Digital document collection and ID verification', 'Integrated search ordering and tracking', 'Automated client updates at each milestone'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Streamline your practice <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Buyers & Sellers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
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
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent font-bold">{i + 1}</span>
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
          <p className="mt-4 text-lg text-gray-300">Join the platform that makes conveyancing faster, clearer, and more connected.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-accent-dark transition-colors">
              Get Started Free
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-primary-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">&copy; 2025 documove.co.uk. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
