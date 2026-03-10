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

const STATE_CONFIG = {
  active: { label: 'ACTIVE', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  closed: { label: 'CLOSED', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
  pending: { label: 'PENDING', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
};

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

export default function ProposalCard({ proposal, spaceId }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cfg = STATE_CONFIG[proposal.state as keyof typeof STATE_CONFIG] || STATE_CONFIG.closed;
  const topChoice = proposal.choices?.[0];
  const topScore = proposal.scores?.[0] || 0;
  const totalScore = proposal.scores_total || 1;
  const topPct = ((topScore / totalScore) * 100).toFixed(1);

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
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-all hover:shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${proposal.state === 'active' ? 'animate-pulse' : ''}`}></span>
              {cfg.label}
            </span>
            {proposal.state === 'active' && (
              <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                ⏰ {timeLeft(proposal.end)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {proposal.state === 'closed' ? formatDate(proposal.end) : `Ends ${formatDate(proposal.end)}`}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">{proposal.title}</h3>

        {proposal.body && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {proposal.body.replace(/#+\s/g, '').replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 200)}…
          </p>
        )}

        {/* Vote breakdown */}
        {proposal.scores_total > 0 && proposal.choices?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                {(proposal.votes || 0).toLocaleString()} votes · {(proposal.scores_total || 0).toLocaleString(undefined, {maximumFractionDigits: 0})} tokens
              </span>
              <span className="text-xs font-medium text-gray-700">{topChoice}: {topPct}%</span>
            </div>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
              {proposal.choices.slice(0, 5).map((choice: string, i: number) => {
                const score = proposal.scores?.[i] || 0;
                const pct = (score / totalScore) * 100;
                const colors = ['bg-blue-500', 'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'];
                if (pct < 0.5) return null;
                return (
                  <div
                    key={choice}
                    className={`${colors[i % colors.length]} transition-all`}
                    style={{ width: `${pct}%` }}
                    title={`${choice}: ${pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex gap-3 mt-1.5">
              {proposal.choices.slice(0, 4).map((choice: string, i: number) => {
                const score = proposal.scores?.[i] || 0;
                const pct = ((score / totalScore) * 100).toFixed(0);
                const colors = ['text-blue-600', 'text-red-500', 'text-yellow-600', 'text-green-600'];
                return (
                  <span key={choice} className={`text-xs ${colors[i % colors.length]}`}>
                    {choice.slice(0, 12)}: {pct}%
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <button
            onClick={getSummary}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
          >
            {loadingSummary ? (
              <><span className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></span> Analyzing…</>
            ) : summary ? (
              expanded ? '▲ Hide AI Summary' : '▼ Show AI Summary'
            ) : (
              '✨ AI Summary'
            )}
          </button>
          <a
            href={snapshotLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
          >
            View on Snapshot ↗
          </a>
          <span className="ml-auto text-xs text-gray-400">by {proposal.author?.slice(0, 8)}…</span>
        </div>
      </div>

      {/* AI Summary Expansion */}
      {expanded && (
        <div className="border-t border-blue-50 bg-blue-50 px-5 py-4">
          {loadingSummary ? (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>AI is reading and analyzing this proposal…</span>
            </div>
          ) : summary ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">✨ AI Summary</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
