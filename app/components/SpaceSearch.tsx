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
    <div className="max-w-lg">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search any DAO — Uniswap, ENS, Optimism…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white transition-all"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? '…' : 'Search'}
        </button>
      </div>

      {searched && results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden text-left">
          {results.slice(0, 6).map((space: any) => (
            <button
              key={space.id}
              onClick={() => {
                onSelect(space.id, space.name);
                setResults([]);
                setQuery('');
                setSearched(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{space.name}</div>
                <div className="text-xs font-mono text-gray-400">{space.id}</div>
              </div>
              <div className="text-xs text-gray-400">{(space.followersCount || 0).toLocaleString()} members</div>
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl p-4 text-center text-sm text-gray-500">
          No DAO found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
