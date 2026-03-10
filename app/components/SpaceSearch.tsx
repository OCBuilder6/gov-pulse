'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  onSelect: (spaceId: string, spaceName: string) => void;
}

export default function SpaceSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch(`/api/search-space?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.spaces || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length >= 2) search(e.target.value);
    else { setResults([]); setOpen(false); }
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex items-center rounded-lg px-3 gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search any DAO…"
          value={query}
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && search(query)}
          className="flex-1 py-2 text-sm bg-transparent focus:outline-none"
          style={{ color: 'white' }}
        />
        {loading && <div className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }} />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-50" style={{ background: '#1e2236', border: '1px solid rgba(255,255,255,0.1)' }}>
          {results.slice(0, 6).map((space: any, i: number) => (
            <button key={space.id} onClick={() => { onSelect(space.id, space.name); setQuery(''); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div>
                <div className="text-sm font-medium text-white">{space.name}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{space.id}</div>
              </div>
              <div className="text-xs ml-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {(space.followersCount || 0).toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl p-3 text-center text-sm shadow-xl z-50"
          style={{ background: '#1e2236', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
