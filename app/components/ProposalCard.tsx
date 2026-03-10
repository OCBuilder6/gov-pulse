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
  link?: string;
}

interface Props {
  proposal: Proposal;
  spaceId: string;
}

const CHOICE_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'];

function timeLeft(endTs: number): string {
  const now = Date.now() / 1000;
  const diff = endTs - now;
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortAddress(addr: string): string {
  if (!addr) return '';
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

export default function ProposalCard({ proposal, spaceId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isActive = proposal.state === 'active';
  const totalScore = proposal.scores_total || 1;

  const getSummary = async () => {
    if (summary) { setExpanded(!expanded); return; }
    setLoadingSummary(true);
    setExpanded(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: proposal.title,
          body: proposal.body?.slice(0, 3000) || '',
          choices: proposal.choices,
        }),
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
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all"
      style={{
        border: '1px solid #e2e8f0',
        borderLeft: `4px solid ${isActive ? '#10b981' : '#cbd5e1'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div className="p-5">

        {/* Top row: status + date */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
              style={isActive
                ? { background: 'rgba(16,185,129,0.1)', color: '#059669' }
                : { background: '#f1f5f9', color: '#64748b' }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'animate-pulse' : ''}`}
                style={{ background: isActive ? '#10b981' : '#94a3b8' }}
              ></span>
              {isActive ? 'ACTIVE' : proposal.state === 'pending' ? 'PENDING' : 'CLOSED'}
            </span>

            {/* Time left pill (active only) */}
            {isActive && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
                ⏰ {timeLeft(proposal.end)}
              </span>
            )}
          </div>

          <span className="text-xs" style={{ color: '#94a3b8' }}>
            {isActive ? `Ends ${formatDate(proposal.end)}` : formatDate(proposal.end)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">{proposal.title}</h3>

        {/* Excerpt */}
        {proposal.body && (
          <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: '#64748b' }}>
            {proposal.body.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 220)}…
          </p>
        )}

        {/* Vote breakdown */}
        {proposal.scores_total > 0 && proposal.choices?.length > 0 && (
          <div className="mb-4">
            {/* Meta */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                {(proposal.votes || 0).toLocaleString()} votes · {(proposal.scores_total || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
              </span>
            </div>

            {/* Bar */}
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
              {proposal.choices.slice(0, 5).map((choice: string, i: number) => {
                const score = proposal.scores?.[i] || 0;
                const pct = (score / totalScore) * 100;
                if (pct < 0.5) return null;
                return (
                  <div
                    key={choice}
                    style={{ width: `${pct}%`, background: CHOICE_COLORS[i % CHOICE_COLORS.length] }}
                    title={`${choice}: ${pct.toFixed(1)}%`}
                    className="transition-all"
                  />
                );
              })}
            </div>

            {/* Choice legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {proposal.choices.slice(0, 4).map((choice: string, i: number) => {
                const score = proposal.scores?.[i] || 0;
                const pct = ((score / totalScore) * 100).toFixed(0);
                return (
                  <span key={choice} className="flex items-center gap-1 text-xs" style={{ color: '#64748b' }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: CHOICE_COLORS[i % CHOICE_COLORS.length] }}></span>
                    {choice.slice(0, 14)}: <span className="font-semibold" style={{ color: CHOICE_COLORS[i % CHOICE_COLORS.length] }}>{pct}%</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: '#f1f5f9' }}>
          <button
            onClick={getSummary}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            {loadingSummary ? (
              <>
                <span className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></span>
                Analyzing…
              </>
            ) : summary ? (
              expanded ? '▲ Hide Summary' : '▼ AI Summary'
            ) : (
              '✦ AI Summary'
            )}
          </button>

          <a
            href={snapshotLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
          >
            View on Snapshot ↗
          </a>

          <span className="ml-auto text-xs font-mono" style={{ color: '#cbd5e1' }}>
            {shortAddress(proposal.author)}
          </span>
        </div>
      </div>

      {/* AI Summary panel */}
      {expanded && (
        <div className="border-t px-5 py-4" style={{ background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.12)' }}>
          {loadingSummary ? (
            <div className="flex items-center gap-3 text-sm" style={{ color: '#6366f1' }}>
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
              <span>Reading and analyzing proposal…</span>
            </div>
          ) : summary ? (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#6366f1' }}>✦ AI Summary</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>{summary}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
