'use client';

import { useState, useEffect } from 'react';
import ProposalCard from './components/ProposalCard';
import SpaceSearch from './components/SpaceSearch';
import PricingSection from './components/PricingSection';

const FEATURED_SPACES = [
  { id: 'uniswapgovernance.eth', name: 'Uniswap',  color: '#ff007a', abbr: 'UNI' },
  { id: 'aave.eth',              name: 'Aave',      color: '#b6509e', abbr: 'AAVE' },
  { id: 'compound-governance.eth', name: 'Compound', color: '#00d395', abbr: 'COMP' },
  { id: 'gitcoindao.eth',        name: 'Gitcoin',   color: '#02c4a0', abbr: 'GTC' },
  { id: 'ens.eth',               name: 'ENS',       color: '#5298ff', abbr: 'ENS' },
  { id: 'arbitrumfoundation.eth',name: 'Arbitrum',  color: '#28a0f0', abbr: 'ARB' },
];

export default function Home() {
  const [selectedSpace, setSelectedSpace] = useState('uniswapgovernance.eth');
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

  useEffect(() => { fetchProposals(selectedSpace, activeTab); }, [selectedSpace, activeTab]);

  const selectedDAO = FEATURED_SPACES.find(s => s.id === selectedSpace);

  return (
    <div className="min-h-screen" style={{ background: '#f4f5f7', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Top nav ──────────────────────────────────────── */}
      <header style={{ background: '#1a1d2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="font-bold text-white text-base tracking-tight">GovPulse</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <SpaceSearch onSelect={(id, name) => setSelectedSpace(id)} />
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href="#pricing" className="text-sm hidden sm:block" style={{ color: 'rgba(255,255,255,0.45)' }}>Pricing</a>
            <a href="#pricing" className="text-sm font-semibold text-white px-3.5 py-1.5 rounded-lg" style={{ background: '#7c3aed' }}>
              Go Pro
            </a>
          </div>
        </div>
      </header>

      {/* ── App shell ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-5">

        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="w-56 flex-shrink-0 hidden lg:block">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-medium" style={{ color: '#10b981' }}>Live governance data</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">DAOs</p>
          <nav className="flex flex-col gap-0.5 mb-6">
            {FEATURED_SPACES.map(dao => (
              <button
                key={dao.id}
                onClick={() => setSelectedSpace(dao.id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all w-full"
                style={selectedSpace === dao.id
                  ? { background: 'white', color: '#1a1d2e', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontWeight: 600 }
                  : { background: 'transparent', color: '#6b7280' }}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: dao.color }}>
                  {dao.abbr[0]}
                </span>
                {dao.name}
                {selectedSpace === dao.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7c3aed' }} />
                )}
              </button>
            ))}
          </nav>

          {/* Space info */}
          {spaceInfo && (
            <div className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: selectedDAO?.color || '#7c3aed' }}>
                  {spaceInfo.name?.[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{spaceInfo.name}</div>
                  <div className="text-xs text-gray-400">{(spaceInfo.followersCount || 0).toLocaleString()} holders</div>
                </div>
              </div>
              {spaceInfo.about && (
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{spaceInfo.about}</p>
              )}
            </div>
          )}
        </aside>

        {/* ── Main content ─────────────────────────────── */}
        <main className="flex-1 min-w-0">

          {/* Mobile DAO pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5 lg:hidden">
            {FEATURED_SPACES.map(dao => (
              <button key={dao.id} onClick={() => setSelectedSpace(dao.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium flex-shrink-0 border transition-all"
                style={selectedSpace === dao.id
                  ? { background: '#1a1d2e', color: 'white', borderColor: '#1a1d2e' }
                  : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
                <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: dao.color }} />
                {dao.name}
              </button>
            ))}
          </div>

          {/* Page title + tabs row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{spaceInfo?.name || 'Governance'}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {spaceInfo ? `${(spaceInfo.followersCount || 0).toLocaleString()} token holders` : 'Loading…'}
              </p>
            </div>
            {/* Tabs */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm" style={{ background: 'white' }}>
              {(['active', 'closed'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 text-sm font-semibold capitalize transition-colors"
                  style={activeTab === tab
                    ? { background: '#1a1d2e', color: 'white' }
                    : { background: 'white', color: '#9ca3af' }}>
                  {tab}
                  {tab === 'active' && proposals.length > 0 && activeTab === 'active' && (
                    <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full text-white" style={{ background: '#7c3aed' }}>
                      {proposals.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Proposals */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
              <p className="text-sm text-gray-400">Fetching from Snapshot…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl p-8 text-center bg-red-50 border border-red-100">
              <p className="font-medium text-red-700">{error}</p>
              <button onClick={() => fetchProposals(selectedSpace, activeTab)} className="mt-3 text-sm text-violet-600 hover:underline">Try again</button>
            </div>
          ) : proposals.length === 0 ? (
            <div className="rounded-2xl p-16 text-center bg-white border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">🗳️</div>
              <p className="font-semibold text-gray-700">No {activeTab} proposals</p>
              <p className="text-sm text-gray-400 mt-1">Switch to &quot;closed&quot; to see recent votes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {proposals.map(p => <ProposalCard key={p.id} proposal={p} spaceId={selectedSpace} />)}
            </div>
          )}
        </main>
      </div>

      {/* ── Pricing ─────────────────────────────────────── */}
      <PricingSection />

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e5e7eb' }} className="bg-white mt-0">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-900">GovPulse</span>
          </div>
          <p className="text-xs text-gray-400">
            Powered by <a href="https://snapshot.org" target="_blank" rel="noreferrer" className="text-violet-600 hover:underline">Snapshot.org</a> &amp; OpenAI · Not financial advice
          </p>
        </div>
      </footer>
    </div>
  );
}
