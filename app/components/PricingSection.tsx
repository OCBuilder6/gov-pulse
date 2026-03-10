export default function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        { text: 'Browse any DAO', on: true },
        { text: '3 AI summaries / day', on: true },
        { text: 'Live vote counts', on: true },
        { text: 'Email alerts', on: false },
        { text: 'Portfolio tracking', on: false },
      ],
      cta: 'Get started free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      features: [
        { text: 'Everything in Free', on: true },
        { text: 'Unlimited AI summaries', on: true },
        { text: 'Email deadline alerts', on: true },
        { text: 'AI voting recommendations', on: true },
        { text: 'Portfolio impact analysis', on: true },
      ],
      cta: 'Start 14-day free trial',
      highlight: true,
      badge: 'Most Popular',
    },
    {
      name: 'Fund / DAO',
      price: '$99',
      period: 'per month',
      features: [
        { text: 'Everything in Pro', on: true },
        { text: 'Up to 10 team seats', on: true },
        { text: 'API access', on: true },
        { text: 'Custom DAO reports', on: true },
        { text: 'Slack integration', on: true },
      ],
      cta: 'Contact us',
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-gray-50 border-t border-gray-200 py-16 mt-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-3">Pricing</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, transparent pricing</h2>
          <p className="text-gray-500">For DAO participants who want to stay informed — not overwhelmed.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col relative ${
                plan.highlight
                  ? 'bg-gray-900 text-white shadow-xl'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>
                {plan.name}
              </div>

              <div className="mb-1">
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
              </div>
              <div className={`text-sm mb-6 ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>
                {plan.period}
              </div>

              <ul className="space-y-3 text-sm mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f.text} className={`flex items-center gap-2.5 ${
                    f.on
                      ? plan.highlight ? 'text-gray-200' : 'text-gray-600'
                      : plan.highlight ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    <span className={f.on ? 'text-emerald-500' : plan.highlight ? 'text-gray-600' : 'text-gray-300'}>
                      {f.on ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                plan.highlight
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Prices in USD · Cancel anytime · No setup fees
        </p>
      </div>
    </section>
  );
}
