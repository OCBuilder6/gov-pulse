'use client';

import { useState } from 'react';

interface Proposal {
  id: string;
  title: string;
  body: string;
  state: string;
  start: number;
  end: number;
  author: string;
  choices: string[];
  scores: number[];
  scores_total: number;
  votes: number;
}

interface Props {
  proposal: Proposal;
  spaceId: string;
}

const COLORS = ['#7c3aed', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

function timeLeft(endTs: number): string {
  const diff = endTs - Date.now() / 1000;
  if (diff <= 0) return 'Ended';
  const d = Math.floor(diff / 86400), h = Math.floor((diff % 86400) / 3600);
  return d > 0 ? `${d}d ${h}h` : `${h}h left`;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProposalCard({ proposal, spaceId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isActive = proposal.state === 'active';
  const total = proposal.scores_total || 1;

  const getSummary = async () => {
    if (summary) { setExpanded(v => !v); return; }
    setLoadingSummary(true);
    setExpanded(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: proposal.title, body: proposal.body?.slice(0, 3000) || '', choices: proposal.choices }),
      });
      const data = await res.json();
      setSummary(data.summary || 'Unable to generate summary.');
    } catch {
      setSummary('Unable to generate AI summary at this time.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const snapshotLink = `https://snapshot.org/#/${spaceId}/proposal/${proposal.id}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
              style={isActive
                ? { background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }
                : { background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse bg-emerald-500' : 'bg-gray-400'}`} />
              {isActive ? 'Live vote' : 'Closed'}
            </span>

            {isActive && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(245,158,11,0.08)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)' }}>
                ⏱ {timeLeft(proposal.end)}
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
            {isActive ? `Ends ${formatDate(proposal.end)}` : formatDate(proposal.end)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2">{proposal.title}</h3>

        {/* Body excerpt */}
        {proposal.body && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {proposal.body.replace(/#+\s?/g, '').replace(/\*+/g, '').replace(/\n+/g, ' ').trim().slice(0, 240)}
          </p>
        )}

        {/* Vote visualization */}
        {proposal.scores_total > 0 && proposal.choices?.length > 0 && (
          <div className="mb-4">
            {/* Stacked bar */}
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-gray-100 mb-2">
              {proposal.choices.slice(0, 5).map((c, i) => {
                const pct = ((proposal.scores?.[i] || 0) / total) * 100;
                if (pct < 0.5) return null;
                return <div key={c} style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} title={`${c}: ${pct.toFixed(1)}%`} />;
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {proposal.choices.slice(0, 4).map((c, i) => {
                const pct = ((proposal.scores?.[i] || 0) / total * 100);
                return (
                  <span key={c} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {c.slice(0, 12)}&nbsp;
                    <span className="font-semibold text-gray-700">{pct.toFixed(0)}%</span>
                  </span>
                );
              })}
              <span className="text-xs text-gray-400 ml-auto">
                {(proposal.votes || 0).toLocaleString()} votes
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>
          <button onClick={getSummary}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(124,58,237,0.07)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.15)' }}>
            {loadingSummary
              ? <><span className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} /> Analyzing…</>
              : summary
                ? expanded ? '▲ Hide' : '▼ AI Summary'
                : '✦ AI Summary'
            }
          </button>

          <a href={snapshotLink} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500"
            style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
            Snapshot ↗
          </a>

          <span className="ml-auto text-xs font-mono" style={{ color: '#d1d5db' }}>
            {proposal.author ? proposal.author.slice(0, 6) + '…' + proposal.author.slice(-4) : ''}
          </span>
        </div>
      </div>

      {/* AI Summary panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.03)' }} className="px-5 py-4">
          {loadingSummary ? (
            <div className="flex items-center gap-3 text-sm" style={{ color: '#7c3aed' }}>
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0" style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
              Reading proposal…
            </div>
          ) : summary ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#7c3aed' }}>✦ AI Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
