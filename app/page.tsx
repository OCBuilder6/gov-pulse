'use client';

import { useState, useEffect } from 'react';
import ProposalCard from './components/ProposalCard';
import SpaceSearch from './components/SpaceSearch';
import PricingSection from './components/PricingSection';

const FEATURED_SPACES = [
  { id: 'uniswapgovernance.eth', name: 'Uniswap', logo: '🦄' },
  { id: 'aave.eth', name: 'Aave', logo: '👻' },
  { id: 'compound-governance.eth', name: 'Compound', logo: '🔷' },
  { id: 'gitcoindao.eth', name: 'Gitcoin', logo: '🌿' },
  { id: 'ens.eth', name: 'ENS', logo: '🌐' },
  { id: 'arbitrumfoundation.eth', name: 'Arbitrum', logo: '🔵' },
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

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center" style={{background:'#0f1f3d'}}>
              <span className="text-white text-xs font-bold">GP</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">GovPulse</span>
              <span className="ml-2 text-xs text-gray-500 font-normal uppercase tracking-wider">AI Governance Intel</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#pricing" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Go Pro →
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            Live governance data from Snapshot.org
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Never miss a DAO vote again
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
            AI-powered summaries of real DAO proposals. Understand what you're voting on in seconds, not hours.
          </p>
          <SpaceSearch onSelect={handleSpaceSelect} />
        </div>
      </div>

      {/* Featured DAOs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Featured DAOs</span>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {FEATURED_SPACES.map(space => (
            <button
              key={space.id}
              onClick={() => handleSpaceSelect(space.id, space.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                selectedSpace === space.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              <span>{space.logo}</span>
              {space.name}
            </button>
          ))}
        </div>

        {/* Space Info */}
        {spaceInfo && (
          <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{spaceInfo.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{spaceInfo.id}</p>
                {spaceInfo.about && (
                  <p className="text-sm text-gray-600 mt-2 max-w-2xl">{spaceInfo.about.slice(0, 200)}{spaceInfo.about.length > 200 ? '…' : ''}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{(spaceInfo.followersCount || 0).toLocaleString()}</div>
                <div className="text-xs text-gray-500">token holders</div>
              </div>
            </div>
            {spaceInfo.categories && spaceInfo.categories.length > 0 && (
              <div className="flex gap-2 mt-3">
                {spaceInfo.categories.map((cat: string) => (
                  <span key={cat} className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-200">{cat}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {(['active', 'closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab} Proposals
              {tab === 'active' && proposals.length > 0 && activeTab === 'active' && (
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{proposals.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Proposals */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm">Fetching proposals from Snapshot...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-xl border border-red-100">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={() => fetchProposals(selectedSpace, activeTab)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-3xl mb-3">🗳️</div>
            <p className="text-gray-600 font-medium">No {activeTab} proposals found</p>
            <p className="text-gray-400 text-sm mt-1">Switch to &quot;closed&quot; to see past votes</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} spaceId={selectedSpace} />
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-slate-50 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            GovPulse — Real-time DAO governance intelligence powered by{' '}
            <a href="https://snapshot.org" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Snapshot.org</a>
            {' '}and OpenAI. Data is live and pulled directly from blockchain governance systems.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Not financial or voting advice. Always read full proposals before voting.
          </p>
        </div>
      </footer>
    </div>
  );
}
