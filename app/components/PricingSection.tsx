export default function PricingSection() {
  return (
    <section id="pricing" className="py-20" style={{ background: '#0a0f1e' }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Pricing</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>For DAO participants who want to stay informed — not overwhelmed.</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 items-stretch">

          {/* Free */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Free</div>
            <div className="mb-1">
              <span className="text-4xl font-bold text-white">$0</span>
            </div>
            <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Forever free</div>
            <ul className="space-y-3 text-sm mb-8 flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {[
                { text: 'Browse any DAO', included: true },
                { text: '3 AI summaries/day', included: true },
                { text: 'Live vote counts', included: true },
                { text: 'Email alerts', included: false },
                { text: 'Portfolio tracking', included: false },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-2.5">
                  <span style={{ color: item.included ? '#10b981' : 'rgba(255,255,255,0.15)' }}>
                    {item.included ? '✓' : '✗'}
                  </span>
                  <span style={{ color: item.included ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Get started free
            </button>
          </div>

          {/* Pro — highlighted */}
          <div className="rounded-2xl p-6 flex flex-col relative" style={{ background: '#6366f1', border: '1px solid rgba(99,102,241,0.5)', boxShadow: '0 0 40px rgba(99,102,241,0.25)' }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
              Most Popular
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Pro</div>
            <div className="mb-1">
              <span className="text-4xl font-bold text-white">$12</span>
            </div>
            <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>per month</div>
            <ul className="space-y-3 text-sm mb-8 flex-1">
              {[
                'Everything in Free',
                'Unlimited AI summaries',
                'Email deadline alerts',
                'AI voting recommendations',
                'Portfolio impact analysis',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'white', color: '#6366f1' }}
            >
              Start 14-day free trial
            </button>
          </div>

          {/* Fund / DAO */}
          <div className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Fund / DAO</div>
            <div className="mb-1">
              <span className="text-4xl font-bold text-white">$99</span>
            </div>
            <div className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>per month</div>
            <ul className="space-y-3 text-sm mb-8 flex-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {[
                'Everything in Pro',
                'Up to 10 team seats',
                'API access',
                'Custom DAO reports',
                'Slack integration',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span style={{ color: '#10b981' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Contact us
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Prices in USD · Cancel anytime · No setup fees
        </p>
      </div>
    </section>
  );
}
