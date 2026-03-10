export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 mt-4" style={{ background: '#1a1d2e' }}>
      <div className="max-w-5xl mx-auto px-5">

        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#a78bfa' }}>Pricing</p>
          <h2 className="text-3xl font-bold text-white mb-3">Stay informed at every level</h2>
          <p className="text-gray-400">From casual token holders to institutional funds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {/* Free */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Free</p>
            <div className="mb-1"><span className="text-4xl font-bold text-white">$0</span></div>
            <p className="text-sm text-gray-500 mb-6">Forever</p>
            <ul className="space-y-3 text-sm mb-8 flex-1">
              {[['Browse any DAO', true], ['3 AI summaries / day', true], ['Live vote counts', true], ['Email alerts', false], ['Portfolio tracking', false]].map(([t, on]) => (
                <li key={t as string} className="flex items-center gap-2.5">
                  <span style={{ color: on ? '#10b981' : 'rgba(255,255,255,0.15)' }}>{on ? '✓' : '✗'}</span>
                  <span style={{ color: on ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>{t as string}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Get started
            </button>
          </div>

          {/* Pro */}
          <div className="rounded-2xl p-6 flex flex-col relative" style={{ background: 'linear-gradient(135deg, #6d28d9, #7c3aed)', boxShadow: '0 0 40px rgba(124,58,237,0.3)' }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-gray-900"
              style={{ background: '#fbbf24' }}>Most Popular</div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Pro</p>
            <div className="mb-1"><span className="text-4xl font-bold text-white">$12</span></div>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>per month</p>
            <ul className="space-y-3 text-sm mb-8 flex-1">
              {['Everything in Free', 'Unlimited AI summaries', 'Email deadline alerts', 'AI voting recommendations', 'Portfolio impact analysis'].map(t => (
                <li key={t} className="flex items-center gap-2.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>✓</span>{t}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl text-sm font-bold bg-white text-violet-700 hover:bg-violet-50 transition-colors">
              Start 14-day free trial
            </button>
          </div>

          {/* Fund */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Fund / DAO</p>
            <div className="mb-1"><span className="text-4xl font-bold text-white">$99</span></div>
            <p className="text-sm text-gray-500 mb-6">per month</p>
            <ul className="space-y-3 text-sm mb-8 flex-1">
              {['Everything in Pro', '10 team seats', 'API access', 'Custom DAO reports', 'Slack integration'].map(t => (
                <li key={t} className="flex items-center gap-2.5">
                  <span style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Contact us
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">Prices in USD · Cancel anytime · No setup fees</p>
      </div>
    </section>
  );
}
