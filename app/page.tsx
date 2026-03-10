'use client';

import { useState, useEffect } from 'react';
import ProposalCard from './components/ProposalCard';
import SpaceSearch from './components/SpaceSearch';
import PricingSection from './components/PricingSection';

const FEATURED_SPACES = [
  { id: 'uniswapgovernance.eth', name: 'Uniswap', abbr: 'UNI', color: '#ff007a' },
  { id: 'aave.eth', name: 'Aave', abbr: 'AAVE', color: '#b6509e' },
  { id: 'compound-governance.eth', name: 'Compound', abbr: 'COMP', color: '#00d395' },
  { id: 'gitcoindao.eth', name: 'Gitcoin', abbr: 'GTC', color: '#02c4a0' },
  { id: 'ens.eth', name: 'ENS', abbr: 'ENS', color: '#5298ff' },
  { id: 'arbitrumfoundation.eth', name: 'Arbitrum', abbr: 'ARB', color: '#28a0f0' },
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
    <div className="min-h-screen font-sans" style={{ background: '#f1f5f9' }}>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#0a0f1e', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: '#6366f1', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3.5" fill="white" />
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" strokeDasharray="2.5 2" opacity="0.55" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-white tracking-tight">GovPulse</span>
              <span className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)' }}>DAO Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm font-medium hidden sm:block transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              Pricing
            </a>
            <a href="#pricing" className="text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
              style={{ background: '#6366f1', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
              Go Pro →
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="hero-grid" style={{ background: '#0a0f1e' }}>
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-medium"
            style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Live governance data · 500+ DAOs · Snapshot.org
          </div>

          <h1 className="gradient-text text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-5">
            Never miss a<br />DAO vote again
          </h1>
          <p className="text-lg max-w-lg mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            AI-powered summaries of real proposals. Turn 2,000-word governance docs into four clear sentences.
          </p>

          <SpaceSearch onSelect={handleSpaceSelect} />

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {[
              { value: '500+', label: 'DAOs tracked' },
              { value: 'Live', label: 'Vote counts' },
              { value: 'GPT-4o', label: 'AI summaries' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-6 mr-[-1.5rem]" style={{ background: 'rgba(255,255,255,0.08)' }}></div>}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-semibold text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>{stat.value}</span>
                  <span className="text-xs">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Featured DAOs */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>Featured DAOs</p>
          <div className="flex flex-wrap gap-2">
            {FEATURED_SPACES.map(space => {
              const isSelected = selectedSpace === space.id;
              return (
                <button
                  key={space.id}
                  onClick={() => handleSpaceSelect(space.id, space.name)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all"
                  style={isSelected
                    ? { background: '#0a0f1e', color: 'white', borderColor: '#0a0f1e', boxShadow: '0 2px 8px rgba(10,15,30,0.25)' }
                    : { background: 'white', color: '#475569', borderColor: '#e2e8f0' }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: space.color, fontSize: '9px', fontWeight: 800, letterSpacing: 0 }}
                  >
                    {space.abbr[0]}
                  </span>
                  {space.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Space Info card */}
        {spaceInfo && (
          <div className="bg-white rounded-2xl p-6 mb-6 border shadow-sm" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                  style={{ background: selectedSpaceData?.color || '#6366f1' }}
                >
                  {(spaceInfo.name || '?')[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{spaceInfo.name}</h2>
                  <p className="text-xs font-mono mt-0.5" style={{ color: '#94a3b8' }}>{spaceInfo.id}</p>
                  {spaceInfo.about && (
                    <p className="text-sm mt-2 max-w-xl" style={{ color: '#64748b' }}>
                      {spaceInfo.about.slice(0, 180)}{spaceInfo.about.length > 180 ? '…' : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-gray-900">{(spaceInfo.followersCount || 0).toLocaleString()}</div>
                <div className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>token holders</div>
              </div>
            </div>
            {spaceInfo.categories?.length > 0 && (
              <div className="flex gap-2 mt-4">
                {spaceInfo.categories.map((cat: string) => (
                  <span key={cat} className="text-xs px-2.5 py-1 rounded-full border" style={{ background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }}>{cat}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden w-fit border shadow-sm bg-white" style={{ borderColor: '#e2e8f0' }}>
          {(['active', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 text-sm font-semibold capitalize transition-all"
              style={activeTab === tab
                ? { background: '#0a0f1e', color: 'white' }
                : { background: 'white', color: '#64748b' }}
            >
              {tab} Proposals
              {tab === 'active' && proposals.length > 0 && activeTab === 'active' && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full text-white" style={{ background: '#6366f1' }}>{proposals.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Proposals list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>Fetching from Snapshot…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
            <div className="text-3xl mb-3">⚠️</div>
            <p className="font-medium" style={{ color: '#be123c' }}>{error}</p>
            <button onClick={() => fetchProposals(selectedSpace, activeTab)} className="mt-4 text-sm" style={{ color: '#6366f1' }}>
              Try again
            </button>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border bg-white" style={{ borderColor: '#e2e8f0' }}>
            <div className="text-4xl mb-4">🗳️</div>
            <p className="font-semibold text-gray-700">No {activeTab} proposals found</p>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Switch to &quot;closed&quot; to see past votes</p>
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
      <footer className="border-t py-10" style={{ background: '#0a0f1e', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#6366f1' }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3.5" fill="white" />
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" strokeDasharray="2.5 2" opacity="0.55" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">GovPulse</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Real-time DAO governance powered by{' '}
            <a href="https://snapshot.org" target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>Snapshot.org</a>
            {' '}and OpenAI.
          </p>
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Not financial or voting advice. Always read full proposals before voting.
          </p>
        </div>
      </footer>
    </div>
  );
}
