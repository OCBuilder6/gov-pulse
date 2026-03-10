'use client';

import { useState, useEffect } from 'react';
import ProposalCard from './components/ProposalCard';
import SpaceSearch from './components/SpaceSearch';
import PricingSection from './components/PricingSection';

const FEATURED_SPACES = [
  { id: 'uniswapgovernance.eth', name: 'Uniswap', color: '#ff007a' },
  { id: 'aave.eth', name: 'Aave', color: '#b6509e' },
  { id: 'compound-governance.eth', name: 'Compound', color: '#00d395' },
  { id: 'gitcoindao.eth', name: 'Gitcoin', color: '#02c4a0' },
  { id: 'ens.eth', name: 'ENS', color: '#5298ff' },
  { id: 'arbitrumfoundation.eth', name: 'Arbitrum', color: '#28a0f0' },
];

export default function Home() {
  const [selectedSpace, setSelectedSpace] = useState<string>('uniswapgovernance.eth');
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>('Uniswap');
  const [proposals, setProposals] = useState<any[]>([]);
  const [spaceInfo, setSpaceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  const fetchProposals = async (spaceId: string, state: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/proposals?space=${encodeURIComponent(spaceId)}&state=${state}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProposals(data.proposals || []);
      setSpaceInfo(data.space || null);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch proposals');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals(selectedSpace, activeTab);
  }, [selectedSpace, activeTab]);

  const handleSpaceSelect = (spaceId: string, spaceName: string) => {
    setSelectedSpace(spaceId);
    setSelectedSpaceName(spaceName);
  };

  const selectedSpaceData = FEATURED_SPACES.find(s => s.id === selectedSpace);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3.5" fill="white" />
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" strokeDasharray="2.5 2" opacity="0.6" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">GovPulse</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
              Pricing
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Pro →
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-sm font-medium text-indigo-600 mb-3 tracking-wide uppercase">
            Live · 500+ DAOs · Snapshot.org
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 max-w-2xl">
            Never miss a DAO vote again.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-8">
            AI-powered summaries of real DAO proposals. Understand what you&apos;re voting on in seconds, not hours.
          </p>
          <SpaceSearch onSelect={handleSpaceSelect} />
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <dl className="flex gap-8 flex-wrap">
            {[
              { label: 'DAOs indexed', value: '500+' },
              { label: 'Governance API', value: 'Snapshot.org' },
              { label: 'AI model', value: 'GPT-4o mini' },
              { label: 'Data latency', value: 'Live' },
            ].map(stat => (
              <div key={stat.label}>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{stat.label}</dt>
                <dd className="text-base font-bold text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Featured DAOs */}
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Featured DAOs</p>
          <div className="flex flex-wrap gap-2">
            {FEATURED_SPACES.map(space => {
              const isSelected = selectedSpace === space.id;
              return (
                <button
                  key={space.id}
                  onClick={() => handleSpaceSelect(space.id, space.name)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ background: space.color }}
                  />
                  {space.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Space Info */}
        {spaceInfo && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ background: selectedSpaceData?.color || '#6366f1' }}
                >
                  {(spaceInfo.name || '?')[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{spaceInfo.name}</h2>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{spaceInfo.id}</p>
                  {spaceInfo.about && (
                    <p className="text-sm text-gray-500 mt-1.5 max-w-xl line-clamp-2">{spaceInfo.about}</p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">{(spaceInfo.followersCount || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-0.5">token holders</div>
              </div>
            </div>
            {spaceInfo.categories?.length > 0 && (
              <div className="flex gap-2 mt-4">
                {spaceInfo.categories.map((cat: string) => (
                  <span key={cat} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-6 border-b border-gray-200">
          {(['active', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab} Proposals
              {tab === 'active' && proposals.length > 0 && activeTab === 'active' && (
                <span className="ml-2 text-xs font-semibold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                  {proposals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Proposals */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-400">Fetching proposals from Snapshot…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
            <p className="font-medium text-red-700">{error}</p>
            <button onClick={() => fetchProposals(selectedSpace, activeTab)} className="mt-3 text-sm text-indigo-600 hover:underline">
              Try again
            </button>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="text-4xl mb-4">🗳️</div>
            <p className="font-semibold text-gray-700">No {activeTab} proposals</p>
            <p className="text-sm text-gray-400 mt-1">Switch to &quot;closed&quot; to see past votes</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} spaceId={selectedSpace} />
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-0">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3.5" fill="white" />
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" strokeDasharray="2.5 2" opacity="0.6" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">GovPulse</span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Real-time DAO governance via{' '}
            <a href="https://snapshot.org" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
              Snapshot.org
            </a>{' '}
            · Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
