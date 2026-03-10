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
  if (!addr || addr.length < 10) return addr || '';
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
      style={{ borderLeft: `3px solid ${isActive ? '#10b981' : '#e2e8f0'}` }}
    >
      <div className="p-5">

        {/* Status + date row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : proposal.state === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-emerald-500 animate-pulse' : proposal.state === 'pending' ? 'bg-amber-500' : 'bg-gray-400'
              }`} />
              {isActive ? 'Active' : proposal.state === 'pending' ? 'Pending' : 'Closed'}
            </span>

            {isActive && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                ⏰ {timeLeft(proposal.end)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {isActive ? `Ends ${formatDate(proposal.end)}` : formatDate(proposal.end)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">{proposal.title}</h3>

        {/* Excerpt */}
        {proposal.body && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
            {proposal.body.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 220)}
          </p>
        )}

        {/* Vote bars */}
        {proposal.scores_total > 0 && proposal.choices?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                {(proposal.votes || 0).toLocaleString()} votes · {(proposal.scores_total || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
              </span>
            </div>

            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-gray-100">
              {proposal.choices.slice(0, 5).map((choice: string, i: number) => {
                const pct = ((proposal.scores?.[i] || 0) / totalScore) * 100;
                if (pct < 0.5) return null;
                return (
                  <div key={choice} title={`${choice}: ${pct.toFixed(1)}%`}
                    style={{ width: `${pct}%`, background: CHOICE_COLORS[i % CHOICE_COLORS.length] }}
                    className="transition-all"
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {proposal.choices.slice(0, 4).map((choice: string, i: number) => {
                const pct = ((proposal.scores?.[i] || 0) / totalScore * 100).toFixed(0);
                return (
                  <span key={choice} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full" style={{ background: CHOICE_COLORS[i % CHOICE_COLORS.length] }} />
                    {choice.slice(0, 14)}: <span className="font-semibold text-gray-700">{pct}%</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={getSummary}
            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            {loadingSummary ? (
              <><span className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" /> Analyzing…</>
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
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Snapshot ↗
          </a>

          <span className="ml-auto text-xs font-mono text-gray-300">{shortAddress(proposal.author)}</span>
        </div>
      </div>

      {/* AI Summary panel */}
      {expanded && (
        <div className="border-t border-indigo-50 bg-indigo-50/50 px-5 py-4">
          {loadingSummary ? (
            <div className="flex items-center gap-3 text-sm text-indigo-600">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Reading and analyzing proposal…
            </div>
          ) : summary ? (
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">✦ AI Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
