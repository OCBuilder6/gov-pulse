'use client';

import { useState } from 'react';

interface Props {
  onSelect: (spaceId: string, spaceName: string) => void;
}

export default function SpaceSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search-space?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.spaces || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search any DAO — Uniswap, ENS, Optimism…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="flex-1 px-4 py-3 text-sm rounded-xl focus:outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
          }}
          onFocus={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.11)';
            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
          }}
          onBlur={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: '#6366f1', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}
        >
          {loading ? '…' : 'Search'}
        </button>
      </div>

      {searched && results.length > 0 && (
        <div className="mt-2 rounded-xl overflow-hidden shadow-2xl text-left" style={{ background: '#151c2f', border: '1px solid rgba(255,255,255,0.1)' }}>
          {results.slice(0, 6).map((space: any) => (
            <button
              key={space.id}
              onClick={() => {
                onSelect(space.id, space.name);
                setResults([]);
                setQuery('');
                setSearched(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div className="text-sm font-medium text-white">{space.name}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{space.id}</div>
              </div>
              <div className="text-xs ml-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {(space.followersCount || 0).toLocaleString()} members
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="mt-2 rounded-xl p-4 text-center text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
          No DAO spaces found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
