export default function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 border-t border-gray-100 py-16 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple, transparent pricing</h2>
          <p className="text-gray-500">For DAO participants who want to stay informed — not overwhelmed.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Free */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Free</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-gray-400 text-sm mb-5">Forever free</div>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-6">
              <li className="flex gap-2"><span className="text-green-500">✓</span> Browse any DAO</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> 3 AI summaries/day</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Live vote counts</li>
              <li className="flex gap-2"><span className="text-gray-300">✗</span> Email alerts</li>
              <li className="flex gap-2"><span className="text-gray-300">✗</span> Portfolio tracking</li>
            </ul>
            <button className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Get started
            </button>
          </div>

          {/* Pro */}
          <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-3">Pro</div>
            <div className="text-3xl font-bold text-white mb-1">$12</div>
            <div className="text-blue-200 text-sm mb-5">per month</div>
            <ul className="space-y-2.5 text-sm text-blue-50 mb-6">
              <li className="flex gap-2"><span className="text-blue-200">✓</span> Everything in Free</li>
              <li className="flex gap-2"><span className="text-blue-200">✓</span> Unlimited AI summaries</li>
              <li className="flex gap-2"><span className="text-blue-200">✓</span> Email deadline alerts</li>
              <li className="flex gap-2"><span className="text-blue-200">✓</span> AI voting recommendations</li>
              <li className="flex gap-2"><span className="text-blue-200">✓</span> Portfolio impact analysis</li>
            </ul>
            <button className="w-full py-2.5 rounded-lg bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors">
              Start 14-day trial
            </button>
          </div>

          {/* Fund */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Fund / DAO</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$99</div>
            <div className="text-gray-400 text-sm mb-5">per month</div>
            <ul className="space-y-2.5 text-sm text-gray-600 mb-6">
              <li className="flex gap-2"><span className="text-green-500">✓</span> Everything in Pro</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Up to 10 team seats</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> API access</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Custom DAO reports</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Slack integration</li>
            </ul>
            <button className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Contact us
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Prices in USD. Cancel anytime. No setup fees.
        </p>
      </div>
    </section>
  );
}
